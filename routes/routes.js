var appRouter = function (app) {
     app.get("/", function (req, res) {
          res.status(200).send({ message: 'Welcome to our restful API' });
     });


     app.get("/plant/:limits",async function(req,res){ 
          try {
               
               //parameter init
               const clusterName = "testdpwistron.southeastasia" // Please input your owner data explorer cluster name
               const appid = "65bca692-c1e8-4eb5-92a4-7c6feded42d1"
               const appkey = "appkey"
               const tenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47"


              // var result = await cacheConnection.hgetallAsync(req.params.name)
              const KustoClient = require("azure-kusto-data").Client;
              const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
              // const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(`https://${clusterName}.kusto.windows.net`,'appid','appkey','authorityId'); //authorityId is tenant id
              const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(`https://${clusterName}.kusto.windows.net`,appid,appkey,tenantId);
      
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
          //     kql += "|limit 2 ";
              kql += "|limit " + req.params.limits;
              // kql += "|count";
      
              client.execute("test-db", kql, (err, results) => {
                  if (err) throw new Error(err);
                  // console.log(JSON.stringify(results));
               //    console.log(results.primaryResults[0].toString());
                  res.send(results.primaryResults[0].toString())
              });
      
          
          //     res.send(kql)
          } catch(e) {
              res.send(e)
              // console.log(e);
              // [Error: Uh oh!]
          }
      });
}
module.exports = appRouter;

