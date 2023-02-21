// Funcao que adiciona comportamento ativo ao menu de navegacao
export function activeNav () {
  const navList = document.querySelector("#navLinksRender");
  const navItems = navList.getElementsByClassName("nav-item");

  for (const navItem of navItems) {
    navItems[0].classList.add("active")
    navItem.addEventListener("click", () => {
      for (const item of navItems) {
        item.classList.remove("active")
      }
      navItem.classList.add("active")
    })
  }
}