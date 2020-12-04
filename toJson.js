var converter = require('json-xml-converter');

//Read input
session.input.readAsXML(function (error, NodeList) {
  if (error) {
    // handle error
    session.output.write (error.errorMessage);
  }
  else {
	//take the XML input (NodeList) as an string (stringify), and parse as XML. NOTE: omitXMLDeclaration included.
	var xmlDoc = XML.parse(XML.stringify({omitXmlDeclaration: true, escaping: "minimal"}, NodeList));
	
	//convert XML to JSON with badgerfish conversion type.
	var result = converter.toJSON('badgerfish', xmlDoc);
	
	//output the results.
	session.output.write(result); 
  }
});