const template = document.createElement("template");
template.innerHTML = `
<style>
  :host{
    display: block;
    background-color: #000000;
  }
  ul.horizontal {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
  }

  ul.horizontal li {
    float: left;
  }

  ul.horizontal li a {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  ul.horizontal li a:hover:not(.active) {
    background-color: #000;
  }

  ul.horizontal li a.active {
    background-color:#04AA6D;
  }
  @media (max-width: 480px) {
     ul.horizontal {
        display: none;
    }
  }
  </style>
<ul class="horizontal">
  <li><a id="homeBtn" href="index.html">Home</a></li>
  <li><a id="visualizerBtn" href="app.html">Visualiser</a></li>
  <li><a id="docuBtn" href="docu.html">Documentation</a></li>
</ul>

`;
class NavigationBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const homeBtn = this.homeBtn = this.shadowRoot.querySelector("#homeBtn");
    const visualizerBtn = this.visualizerBtn = this.shadowRoot.querySelector("#visualizerBtn");
    const docuBtn = this.docuBtn = this.shadowRoot.querySelector("#docuBtn");
  }
  connectedCallback() {
    this.homeBtn.onclick = () =>{
      this.homeBtn.style.color="red"
      this.visualizerBtn.style.color="white"
      this.docuBtn.style.color="white"
    }
    this.visualizerBtn.onclick = () =>{
      this.homeBtn.style.color="white"
      this.visualizerBtn.style.color="red"
      this.docuBtn.style.color="white"
    }
    this.docuBtn.onclick = () =>{
      this.homeBtn.style.color="white"
      this.visualizerBtn.style.color="white"
      this.docuBtn.style.color="red"
    }
    this.render();
  }
  render() {

  }
};
customElements.define('nav-bar', NavigationBar);