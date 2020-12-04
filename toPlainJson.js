var util = require('util');
var converter = require('json-xml-converter');

//Read input
session.input.readAsXML(function (error, NodeList) {
  if (error) {
    // handle error
    session.output.write (error.errorMessage);
  }
  else {
	//take the XML input (NodeList) as an string (stringify), and parse as XML.
	var xmlDoc = XML.parse(XML.stringify({omitXmlDeclaration: true, escaping: "minimal"}, NodeList));
	
	//convert XML to JSON with badgerfish conversion type.
	var result = converter.toJSON('badgerfish', xmlDoc);
	
	var bfJson = result;
	var plainJson = {};
	convertBadgerfishToPlainJSON(bfJson, plainJson );

	function convertBadgerfishToPlainJSON(inputDocument, outputDocument) {
	for (var property in inputDocument) {
	  // namespace and attribute properties start with an @, so ignore them
	  if (property.slice(0, 1) != '@') {
		// get this property's value.
		var propertyObj = inputDocument[property];
		// for namespaces, badgerfish includes the namespace property name, so strip it out 
		var i = property.indexOf(':');
		if (i >= 0) {
		  property = property.slice(i + 1);
		}
		// process the property's object based on its type
		var type = util.safeTypeOf(propertyObj);
		switch (type) {
		case 'object':
		  // objects, a child of $ is the property's value
		  if(propertyObj['$']) {
			outputDocument[property] = propertyObj['$'];
		  } else {
			// an object without a child $, this property has child objects, so recurse to convert the children
			outputDocument[property] = {};
			convertBadgerfishToPlainJSON(propertyObj,outputDocument[property])
		  }
		  break;
		case 'array':
		  // any array, recurse to convert the array children
		  outputDocument[property] = [];
		  convertBadgerfishToPlainJSON(propertyObj,outputDocument[property])
		  break;
		default:
		  // don't think we should get here, but just in case, set the property to its scalar value
		  outputDocument[property] = propertyObj;
		  break;
		}
	  }
	}
	}
	session.output.write(plainJson);
  }
});


