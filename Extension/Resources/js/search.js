const Search = {
    init: function() {
        setInterval(async () => {
            if (location.href.includes('www.netflix.com/browse') &&
                !$('.wp-nav-element')[0] && 
                $('.nav-element.show-kids')[0] ) 
            {
                await this.initUI();
                this.initEvents();
            }
        }, 1000);
    },
    initUI: async function() {
        const navEl = document.createElement('div');
        navEl.classList.add('nav-element');
        navEl.classList.add('wp-nav-element');
        $('.nav-element.show-kids').after(navEl);
        await loadHTML('.wp-nav-element', 'html/search.html');
        await this.populateRevealItems();
    },
    initEvents: function() {
        $('#wp-btn-reveal').click('mouseenter', this.onClickBtnReveal);
        $('#wp-reveal-search').on('keyup', this.onKeyUpRevealSearch);
        $('.wp-reveal-items a').on('mouseenter', function() {
            $(this).css('background-color','rgba(255,255,255,.2)');
        });
        $('.wp-reveal-items a').on('mouseleave',function(){
            $(this).css('background-color','transparent');
        });
    },
    onKeyUpRevealSearch: function() {
        const query = $(this).val().toUpperCase();
        $('.wp-reveal-items a').each(function() {
            if (this.innerHTML.toUpperCase().includes(query)) {
                this.style.display = "block";
            } else {
                this.style.display = "none";
            }
        });
    },
    onClickBtnReveal: function() {
        const isHidden = $('.wp-sub-menu').hasClass('wp-d-none');

        if (isHidden) {
            $('.wp-sub-menu').slideDown(500);
            $('.wp-sub-menu').removeClass('wp-d-none');
        } else {
            $('.wp-sub-menu').slideUp(500);
            setTimeout(function() {
                $('.wp-sub-menu').addClass('wp-d-none');
            }, 500);
        }
    },
    splitCategory: function(line) {
        const regExp   =  /^(\S+)\s(.+)$/; //regex to seperate category number and corresponding name
        let match      = null;
        const trimLine = line.replace(/ +/, ""); //trim leading whitespace

        if((match = regExp.exec(trimLine)) !== null){
            if(match.index === regExp.lastIndex){
                regExp.lastIndex++;
            }
        }
        return match;
    },
    createRevealItem: function(link, category) {
        const a        = document.createElement('a');
        const linkText = document.createTextNode(category+'\n');

        a.appendChild(linkText);
        a.tagName = "a";
        a.href    = "http://www.netflix.com/browse/genre/"+link;
        return a;
    },
    populateRevealItems: function() {
        return new Promise(resolve => {
            const xhr     = new XMLHttpRequest();
            xhr.open('GET', chrome.extension.getURL('resources/categories.txt'), true);
            xhr.onreadystatechange = () => {
                if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
                {
                    const lines = xhr.responseText.split('\n'); //create array of all categories in document
                    let categoryLink = null;
                    let categoryName = null;
                    for(let line = 0; line< lines.length;line++){
                        categoryLink = this.splitCategory(lines[line])[1];
                        categoryName = this.splitCategory(lines[line])[2];
                        $('.wp-reveal-items').append(this.createRevealItem(categoryLink, categoryName));
                    }
                    resolve();
                }
            };
            xhr.send();
        });
    },
};