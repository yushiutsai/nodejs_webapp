var appRouter = function (app) {
     app.get("/", function (req, res) {
          res.status(200).send({ message: 'Welcome to our restful API' });
     });
     app.get("/getItems/:num", function (req, res) {
          var num =req.params.num;
          var data = {
               'item1': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-76.jpg',
               'item2': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-77.jpg',
               'item3': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-78.jpg'
          }     
          res.status(200).send(data);
     });
     app.get("/getText/:txt", function (req, res) {
          var text =req.params.txt;
          var data = {
               'text': text
          }
          res.status(200).send(data);
     });

     app.get("/plant/:limits",async function(req,res){ //當連線到Root/ 作出回應
          try {
              // var result = await cacheConnection.hgetallAsync(req.params.name)
              const KustoClient = require("azure-kusto-data").Client;
              const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
              // const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(`https://${clusterName}.kusto.windows.net`,'appid','appkey','authorityId');
              const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(`https://${clusterName}.kusto.windows.net`,'65bca692-c1e8-4eb5-92a4-7c6feded42d1','b8ec2562-dbcc-433e-a439-01fc39e8e39b','72f988bf-86f1-41af-91ab-2d7cd011db47');
      
              const client = new KustoClient(kcsb);
      
              // res.send(req.params.name)
      
              var kql = "TestTable ";
              kql += "|summarize doc_count = count() by plant,line ";
              kql += "|join (TestTable ";
              kql += "        | summarize doc_count = count() by plant,line,program ";
              kql += "        ) ";
              kql += "    on plant,line ";
              kql += "    |join (TestTable ";
              kql += "            |summarize doc_count=count(), doc_avg = avg(cycleTimeTransfer) by plant,line,program,MachineGroupID ";
              kql += "            ) ";
              kql += "        on plant,line,program ";
              kql += "|limit 2 ";
              // kql += "|count";
      
              client.execute("test-db", kql, (err, results) => {
                  if (err) throw new Error(err);
                  // console.log(JSON.stringify(results));
                  console.log(results.primaryResults[0].toString());
                  res.send(results.primaryResults[0].toString())
              });
      
          
              // res.send(kql)
          } catch(e) {
              res.send(e)
              // console.log(e);
              // [Error: Uh oh!]
          }
      });
}
module.exports = appRouter;

