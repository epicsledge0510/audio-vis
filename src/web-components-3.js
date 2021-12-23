const template = document.createElement("template");
template.innerHTML = `
<style>

</style>
<button onClick="window.location.reload();">Refresh Page</button>
`;
class resetBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {

  }
  render() {

  }
};
customElements.define('reset-btn', resetBtn);