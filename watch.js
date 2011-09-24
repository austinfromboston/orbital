 var watch = require('nodewatch');
 var exec = require('child_process').exec;
 // Adding 2 dirs relative from process.cwd()
 // Nested dirs are not watched
 // dirs can also be added absolute
 watch.add("./jade").onChange(function(file,prev,curr){
   console.log("\nrevising due to changes in " + file + "\n");
   exec('jade jade --out public');
 });

