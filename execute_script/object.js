flowFile = session.get();
if (flowFile != null) {

    var StreamCallback = Java.type("org.apache.nifi.processor.io.StreamCallback");
    var IOUtils = Java.type("org.apache.commons.io.IOUtils");
    var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");


    flowFile = session.write(flowFile, new StreamCallback(function (inputStream, outputStream) {
        // Read input FlowFile content
        var inputText = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        var inputObj = JSON.parse(inputText);

        // Transform content
        var outputObj = inputObj;
        var output = []

        for (key in inputObj) {
            if (key === "disp") {
                if (inputObj[key]) {

                    outputObj[key] = inputObj[key]
                    split_array = inputObj[key].split(',')

                    for (i = 0; i < split_array.length; i++) {
                        split_arr = split_array[i].split(":")
                        
                        tmpObj = new Object()
                        tmpObj['disp'] = inputObj['disp']
                        tmpObj[key + "_no_i"] = split_arr[0]
                        tmpObj[key + "_str_k"] = split_arr[1]
                        tmpObj[key + "_sum_k"] = split_arr[0] + "^" + split_arr[1]

                        output.push(tmpObj)
                    }
                }
            }
        }
        outputObj[key + "_total"] = output
        // Write output content
        outputStream.write(JSON.stringify(outputObj, null, "\t").getBytes(StandardCharsets.UTF_8));
    }));



    /*
      // Get Attribute
      var greeting = flowFile.getAttribute("greeting");
      var message = greeting + ", Script!";
  
  
      // Set Attribute
      flowFile = session.putAttribute(flowFile, "message", message);
  
  
      // Set multiple attributes
      flowFile = session.putAllAttributes(flowFile, {
          "attribute.one": "true",
          "attribute.two": "2"
      });
    */


    session.transfer(flowFile, REL_SUCCESS)
}
