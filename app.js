

fetch('https://cdn.rawgit.com/akabab/starwars-api/0.2.1/api/all.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);

    const createCharactTemplate = charactType => {

      function randomNum(min, max) {
        return Math.round( (Math.random() * (max - min) - min) )
      }

      function whatIsMyAge(born, died) {

        function CheckBorn(test){
          if(typeof test === "string")
            return 33
          else if(test !== undefined)
            return test
          else
            return randomNum(0, 75)
        }

        function Checkdied(test){
          if(test !== undefined)
            return test
          else
            return randomNum(0, 75)
        }

        const bornOk = CheckBorn(born)
        const diedOk = Checkdied(died)

        console.log(`je suis né en ${bornOk} et mort en ${diedOk}, j'ai donc ${(diedOk-bornOk)} ans`)
      }

      whatIsMyAge(charactType.born, charactType.died)

      return `
      <div class="project js-item" tabindex="0">
        <img src="${charactType.image}" alt="" class="project__image">
        <h2 class="project__name">${charactType.name}</h2>
        <div class="project__description">
          ${charactType.species ? charactType.species : 'unknown'}
        </div>
        <div class="project__body js-body">
          <h2>Origine : <span class="firstLEtter">${charactType.homeworld ? charactType.homeworld : 'unknown'}</span></h2>
          <p>
            Lorem ipsum dolor sit, consectetur adipisicing elit. Accusantium consequatur, consequuntur, dicta eius
            facilis ipsa ipsum itaque magnam molestias mollitia nemo nihil provident quod saepe sed temporibus ut veniam
            voluptates!
          </p>
          <p>
            Ab architecto, atque autem blanditiis culpa distinctio ea eius harum, hic laudantium maiores possimus, quia
            repellat sunt voluptatum? Aperiam doloremque dolorum facilis ipsum iusto laborum maiores nisi odit officia
            repellendus.
          </p>
          <p>
            <a target="_blank" href="${charactType.wiki}">En savoir plus</a>
          </p>
        </div>
      </div>
      `
    }

    const divContainer = document.getElementById('js-portfolio-flex')
    divContainer.innerHTML = myJson.map(createCharactTemplate).join("")

    class Portfolio {

      /**
       * @param {string} selector
       */
      constructor (selector) {
        this.activeContent = null
        this.activeItem = null
        this.container = document.querySelector(selector)
        if (this.container === null) {
          throw new Error(`L'élement ${selector} n'existe pas`)
        }
        this.children = Array.prototype.slice.call(this.container.querySelectorAll('.js-item'))
        this.children.forEach((child) => {
          child.addEventListener('click', (e) => {
            e.preventDefault()
            this.show(child)
          })
          child.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
              this.show(child)
            }
          })
        })
        if (window.location.hash.startsWith('#')) {
          let element = this.container.querySelector(window.location.hash)
          if (element !== null) {
            this.show(element)
          }
        }
      }

      /**
       * Affiche le contenu d'un élément
       * @param {HTMLElement} child
       */
      show (child) {
        let offset = 0
        if (this.activeContent !== null) {
          this.slideUp(this.activeContent)
          if (this.activeContent.offsetTop < child.offsetTop) {
            offset = this.activeContent.offsetHeight
          }
        }
        if (this.activeItem === child) {
          this.activeContent = null
          this.activeItem = null
        } else {
          let content = child.querySelector('.js-body').cloneNode(true)
          this.injectContent(child, content)
          this.slideDown(content)
          this.scrollTo(child, offset)
          this.activeContent = content
          this.activeItem = child
        }
      }

      /**
       * Insère le clone dans le dom
       * @param {HTMLElement} child
       * @param {HTMLElement} content
       */
      injectContent(child, content) {
        child.after(content)
      }

      /**
       * Affiche l'élément avec un effet d'animation
       * @param {HTMLElement} element
       */
      slideDown (element) {
        let height = element.offsetHeight
        element.style.height = '0px'
        element.style.transitionDuration = '.5s'
        element.offsetHeight // force repaint
        element.style.height = height + 'px'
        window.setTimeout(function () {
          element.style.height = null
        }, 500)
      }

      /**
       * Masque l'élément avec un effet d'animation
       * @param {HTMLElement} element
       */
      slideUp (element) {
        let height = element.offsetHeight
        element.style.height = height + 'px'
        element.offsetHeight // force repaint
        element.style.height = '0px'
        window.setTimeout(function () {
          element.parentNode.removeChild(element)
        }, 500)
      }

      /**
       * Fait défiler la fenêtre jusqu'à l'élément
       * @param {HTMLElement} element
       * @param {int} offset
       */
      scrollTo (element, offset = 0) {
        window.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: element.offsetTop - offset
        })
      }

    }
    class PortfolioFlex extends Portfolio {

      injectContent (child, content) {
        let index = this.children.findIndex(c => c === child)
        let offsetTop = child.offsetTop
        let i
        for (i = index; i < this.children.length; i++) {
          if (this.children[i].offsetTop > offsetTop) {
            break
          }
        }
        this.children[i - 1].after(content)
      }

    }

    new Portfolio('#js-portfolio')
    new PortfolioFlex('#js-portfolio-flex')

  })
