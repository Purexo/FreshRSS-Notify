function getTemplate(name) {
  if (!("content" in document.createElement("template"))) {
    throw new Error('ERR_UNSUPPORTED_TEMPLATE_TAG Your browser doesn\'t support template tag');
  }
  
  const template = document.querySelector(`template#${name}`);
  return document.importNode(template.content, true);
}