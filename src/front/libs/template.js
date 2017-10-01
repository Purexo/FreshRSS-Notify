function getTemplate(name) {
  if (!("content" in document.createElement("template"))) {
    throw new Error('Your browser doesn\'t support template tag', 'ERR_UNSUPPORTED_TEMPLATE_TAG');
  }
  
  const template = document.querySelector(`template#${name}`);
  return document.importNode(template.content, true);
}