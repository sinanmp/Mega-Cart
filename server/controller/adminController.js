const userDb = require("../model/userModel");
const fs = require("fs");
const blockDb = require("../model/blockModel")
const orderDb=require("../model/orderSchema")
exports.register = async (req, res) => {
    const iemail = "admin@gmail.com";
    const ipass = 1234;
    try {
        if (req.body.email == iemail && req.body.password == ipass) {
            req.session.adminIsAuth=true
            req.session.adminLogerror=false
            res.redirect("/adminDash");
        } else {
            req.session.adminLogerror=true   
            req.session.adminIsAuth=false
            res.redirect("/adminLogin");
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};

exports.find = async (req, res) => {
    try {
        const users = await userDb.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};

exports.block = (req, res) => {
    const nemail = req.query.email
    blockDb.create({ email: nemail })
        .then(blockdata => {
            userDb.updateOne({ email: nemail }, { $set: { block: "true", status: "Inactive" } })
                .then(data => {
                    delete req.session.isAuth
                    res.redirect("/admin-users")
                }).catch(err => {
                    res.send(err)
                })
        }).catch(err => {
            blockDb.deleteOne({ email: nemail })
                .then(data => {
                    userDb.updateOne({ email: nemail }, { $set: { block: "false" } })
                        .then(data => {
                            res.redirect("/admin-users")
                        }).catch(err => {
                            res.send(err)
                        })
                }).catch(err => {
                    res.send(err)
                })

        })
}





exports.countUsers = async (req, res) => {
    try {
        const users = await userDb.find();
        res.send(users)
    } catch (error) {
        console.error("Error counting users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

 
exports.orderList=(req,res)=>{
 orderDb.find().sort({orderDate:-1})
 .then(data=>{
    res.send(data)
 })
    
}


exports.countOrders=(req,res)=>{
    orderDb.find()
    .then(data=>{
        res.send(data)
    })
}




exports.getChart=async (req, res) => {
    try {
      let labelObj = {};
      let salesCount;
      let findQuerry;
      let currentYear;
      let currentMonth;
      let index;
      console.log(req.body.filter);
      switch (req.body.filter) {
        case "Weekly":
          currentYear = new Date().getFullYear();
          currentMonth = new Date().getMonth() + 1;

          labelObj = {
            "Sun": 0,
            "Mon": 1,
            "Tue": 2,
            "Wed": 3,
            "Thu": 4,
            "Fri": 5,
            "Sat": 6,
          };

          salesCount = new Array(7).fill(0);

          findQuerry = {
            orderDate: {
              $gte: new Date(currentYear, currentMonth - 1, 1),
              $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
            }
          };
          index = 0;
          break;
        case "Monthly":
          currentYear = new Date().getFullYear();
          labelObj = {
            "Jan": 0,
            "Feb": 1,
            "Mar": 2,
            "Apr": 3,
            "May": 4,
            "Jun": 5,
            "Jul": 6,
            "Aug": 7,
            "Sep": 8,
            "Oct": 9,
            "Nov": 10,
            "Dec": 11,
          }

          salesCount = new Array(12).fill(0);

          findQuerry = {
            orderDate: {
              $gte: new Date(currentYear, 0, 1), 
              $lte: new Date(currentYear, 11, 31, 23, 59, 59), 
            }
          }
          index = 1;
          break;
          case "Daily":
            currentYear = new Date().getFullYear();
            currentMonth = new Date().getMonth() + 1;
            let end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
            end = String(end).split(' ')[2];
            end = Number(end);

            for(let i = 0; i < end; i++){
              labelObj[`${i + 1}`] = i;
            }

            salesCount = new Array(end).fill(0);

            findQuerry = {
              orderDate: {
                $gte: new Date(currentYear, currentMonth - 1, 1),
                $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
              }
            };
            index = 2;
            break;
          case "Yearly":
            findQuerry = {}

            const ord = await orderDb.find().sort({orderDate: 1});
            const stDate = ord[0].orderDate.getFullYear();
            const endDate = ord[ord.length - 1].orderDate.getFullYear();

            for(let i = 0; i <= (Number(endDate) - Number(stDate)); i++){
              labelObj[`${stDate + i}`] = i;
            }

            salesCount = new Array(Object.keys(labelObj).length).fill(0);

            index = 3;
            break;
        default:
          return res.json({
            label: [],
            salesCount: []
          });
      }

      const orders = await orderDb.find(findQuerry);

      orders.forEach(order => {
        if(index === 2){
            salesCount[labelObj[Number(String(order.orderDate).split(' ')[index])]] += 1;
          }else{
            salesCount[labelObj[String(order.orderDate).split(' ')[index]]] += 1;
          }
      });

      res.json({
        label: Object.keys(labelObj),
        salesCount
      });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server err');
    }
  }

