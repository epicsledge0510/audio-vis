const template = document.createElement("template");
template.innerHTML = `
<style>
#menuBrg
{
  display: block;
  position: relative;
  top: 50px;
  left: 50px;
}

#menuBrg a
{
  text-decoration: none;
  color: black;
}

#menuBrg input
{
  display: block;
  width: 40px;
  height: 32px;
  position: absolute;
  top: -7px;
  left: -5px;
  cursor: pointer;
  opacity: 0; 
  z-index: 2; 
}

#menuBrg span
{
  display: block;
  width: 33px;
  height: 4px;
  margin-bottom: 5px;
  position: relative;
  background: #cdcdcd;
  border-radius: 3px;
  z-index: 1;
}

#menu
{
  position: absolute;
  width: 300px;
  margin: -100px 0 0 -50px;
  padding: 50px;
  padding-top: 125px;
  background: white;
  list-style-type: none;
  transform-origin: 0% 0%;
  transform: translate(-100%, 0);
  transition: transform cubic-bezier(0.77,0.2,0.05,1.0);
}

#menu li
{
  padding: 10px 0;
  font-size: 22px;
}
#menuBrg input:checked ~ ul
{
  transform: none;
}
</style>
<nav role="navigation">
  <div id="menuBrg">
    <input type="checkbox" />
    <span></span>
    <span></span>
    <span></span>
    <ul id="menu">
      <a href="index.html"><li>Home</li></a>
      <a href="app.html"><li>Visualizer</li></a>
      <a href="docu.html"><li>Documentation</li></a>
    </ul>
  </div>
</nav>
`;
class NavigationBurger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    /*this.img.onclick = () => {
      const name = this.getAttribute('data-name');
      const img = this.getAttribute('data-img') ? this.getAttribute('data-img') : "Nobody";
      favesNames.push(name);
      favesImg.push(img);
      saveData();
    }
    this.render();*/
  }
  render() {

  }
  myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
};
customElements.define('nav-brgr', NavigationBurger);