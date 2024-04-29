function defineVal(value) {
  const object = new Object();
  const customEvent = new CustomEvent("_value");
  const nodeVal = document.createTextNode("");

  const listener = (callback) => {
    const listener = () => callback(object.value);

    listener();
    nodeVal.addEventListener("_value", listener);
    return () => nodeVal.removeEventListener("_value", listener);
  };

  const dispatch = () => {
    nodeVal.dispatchEvent(customEvent);
  };

  Object.defineProperty(object, "_value", {
    value: value,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(object, "value", {
    get: function () {
      return this._value;
    },
    set: function (value) {
      if (this._value !== value) {
        this._value = value;
        dispatch();
      }
    },
  });
  Object.defineProperty(object, "observe", {
    value: listener,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.seal(object);

  return object;
}

function createNodeElement(html) {
  const template = document.createElement("div");
  template.innerHTML = html;
  const element = template.children[0];
  template.innerHTML = "";
  return element;
}

function createObjectElement(elements, attribute, remove = false) {
  return Array.from(elements).reduce((prev, curr) => {
    prev[curr.getAttribute(attribute)] = curr;
    if (remove) curr.removeAttribute(attribute);

    return prev;
  }, {});
}
class RenderObjectElement {
  constructor(objectElement = {}) {
    this.savedElement = Object.keys(objectElement).reduce((prev, curr) => {
      prev[curr] = {
        element: objectElement[curr],
        elementText: document.createTextNode(""),
        parent: objectElement[curr].parentElement,
        status: true,
      };
      return prev;
    }, {});
  }

  set(object) {
    Object.keys(object).forEach((key) => {
      const savedElementKey = this.savedElement[key];
      if (savedElementKey) {
        savedElementKey.status = object[key];

        if (savedElementKey.status) {
          if (!savedElementKey.element.parentElement) {
            savedElementKey.elementText.replaceWith(savedElementKey.element);
          }
        } else {
          if (savedElementKey.element.parentElement) {
            savedElementKey.element.replaceWith(savedElementKey.elementText);
          }
        }
      }
    });
  }
}

const encodeInput = (string = '') => {
  if (string.trim() != "") {
    const input = document.createElement("input");
    input.setAttribute("value", string);
    return input.outerHTML.slice(14, -2);
  }

  return string;
};

const encodeTextarea = (string = '') => {
  if (string.trim() != "") {
    const textTarea = document.createElement("textarea");
    textTarea.innerHTML = string;
    return textTarea.innerHTML;
  }

  return string;
};
