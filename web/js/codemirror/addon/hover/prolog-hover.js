define([ "../../lib/codemirror",
	 "jquery",
	 "laconic"
       ],
       function(CodeMirror, $) {
"use strict";

var pathTranslations = {};

var tokenHelp = {
  "goal_built_in":  function(data, cm) {
    if ( data ) {
      return $.el.div(predName(data),
		      cm.tokenInfo(data));
    } else {
      return "Built-in predicate";
    }
  },

  "goal_global":  function(data, cm) {
    if ( data ) {
      return $.el.div(predName(data),
		      cm.tokenInfo(data));
    } else {
      return "Global predicate";
    }
  },

  "goal_autoload":  function(data, cm) {
    if ( data ) {
      return $.el.div(predName(data), " (autoload from ",
		      fileName(data, cm), "): ",
		      cm.tokenInfo(data));
    } else {
      return "Autoloaded predicate";
    }
  },

  "goal_imported":  function(data, cm) {
    if ( data ) {
      return $.el.div(predName(data), " (imported from ",
		      fileName(data, cm), "): ",
		      cm.tokenInfo(data));
    } else {
      return "Imported predicate";
    }
  },

  "goal_recursion": "Recursive call",
  "goal_local":     "Locally defined predicate",
  "goal_dynamic":   "Dynamic predicate",
  "goal_undefined": "Undefined predicate",

  "head_unreferenced": "Predicate is not called",

  "file": function(data, cm) {
    if ( data ) {
      addFileTranslation(cm, data.text, data.path);
      return $.el.div("File: ",
		      $.el.span({class:"file-path"},
				data.path));
    } else {
      return "File name";
    }
  },

  "file_no_depends": function(data, cm) {
    if ( data ) {
      addFileTranslation(cm, data.text, data.path);
      return $.el.div("File: ",
		      $.el.span({class:"file-path"},
				data.path),
		      $.el.div({class:"hover-remark"},
			       "does not resolve any dependencies")
		     );
    } else {
      return "File name (does not resolve any dependencies)";
    }
  },

  "error": function(data, cm) {
    if ( data ) {
      if ( data.expected )
	return $.el.div("error: ", $.el.strong(data.expected), " expected");
    }

    return "error";
  },

  "singleton": "Variable appearing only once",
  "codes":     "List of Unicode code points (integers)",
  "chars":     "List of one-character atoms",
  "string":    "Packed string (SWI7, use `text` for a list of codes)",
  "qatom":     "Quoted atom",
  "tag":       "Tag of a SWI7 dict",

  "head":       null,
  "control":    null,
  "fullstop":   null,
  "var":        null,
  "int":        null,
  "float":      null,
  "number":     null,
  "atom":       null,
  "functor":    null,
  "comment":    null,
  "neck":       null,
  "operator":   null,
  "sep":        null,
  "list_open":  null,
  "list_close": null,
  "dict_open":  null,
  "dict_close": null
};

function predName(data) {
  return $.el.span({class:"pred-name"},
		   data.text+"/"+data.arity);
}

function addFileTranslation(cm, text, path) {
  pathTranslations[path] = text;
}

function fileName(data, cm) {
  var last;

  if ( pathTranslations[data.file] )
    return pathTranslations[data.file];

  if ( (last=data.file.lastIndexOf("/")) )
    return data.file.substring(last+1);

  return data.file;
}

CodeMirror.registerHelper("textHover", "prolog", function(cm, data, node) {
  if ( data ) {
    var token = data.token;
    var help  = tokenHelp[token.type];
    var et;

    if ( help !== undefined ) {
      if ( typeof(help) === "function" ) {
	var r = help(cm.getEnrichedToken(token), cm);

	if ( typeof(r) === "string" )
	  return $.el.div(r);
	else
	  return r;
      } else if ( typeof(help) === "string" ) {
	return $.el.div(help);
      }
    } else if ( (et=cm.getEnrichedToken(token)) ) {
      if ( et.summary && et.info === "ask" )
	return $.el.div(et.summary, cm.tokenInfo(et));
      else if ( et.summary )
	return $.el.div(et.summary);
      else
	return $.el.div(token.type);
    } else {
      return $.el.div(token.type);
    }
  }

  return null;
});

});
