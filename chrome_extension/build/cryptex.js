(() => {
    
    // consts
    const ONE_SECOND    = 1000,
        UPDATE_INTERVAL = 10,
        TWO_HOURS = (60 * 60 * 1000) * 2;

    var animationWidth = 0;

    // Manage checkbox checked val
    let settingsOpen = false;

    // Array of watches exchanges
    const exchangesArray = ['BTC', 'ETH', 'LTC'];
    const $settingsBtn = document.querySelector('.settings__btn');
    const $unsplashUI = document.querySelector('.unsplash');

    var useUnsplashBackground = localStorage.getItem('use_unsplash');

    // Currency
    const currencySymbols = {
        aud: '$',
        brl: 'R$',
        cad: '$',
        cny: '¥',
        eur: '€',
        gbp: '£',
        hkd: 'HK$',
        idr: 'Rp',
        ils: '₪',
        jpy: '¥',
        mxn: '$',
        nok: 'kr',
        nzd: '$',
        pln: 'zł',
        ron: 'L',
        rub: '₽',
        sek: 'kr',
        sgd: 'S$',
        usd: '$',
        zar: 'Z'
    };

    getCurrentPriceForCurrency = (currency) => {
        currency = currency || 'BTC';

        const baseURL = `https://api.coinbase.com/v2/prices/${currency}/spot`

        return fetch(baseURL)
            .then((response) => response.json()).then((data) => {
                return data;
        });
    }

    getDailyHistoricalDataForCurrency = (currency) => {
        currency = currency || 'BTC-USD';

        var now = new Date();

        var oneDayAgo = now.setDate(now.getDate() - 1),
            today   = new Date().getTime();

        // Convert the given time in MS to ISO 8061 string for the GDAX API
        oneDayAgo = new Date(oneDayAgo).toISOString();
        today = new Date(today).toISOString();

        const baseURL = `https://api.gdax.com/products/${currency}/stats`

        return fetch(baseURL)
            .then((response) => response.json()).then((data) => {
                return data;
        });
    }

    getWeeklyHistoricalDataForCurrency = (currency) => {
        currency = currency || 'BTC-USD';

        // Get the current date
        var now   = new Date();
            
        // Subtract one week from today
        var oneWeek = now.setDate(now.getDate() - 7),
            today   = new Date().getTime();

        // Convert the given time in MS to ISO 8061 string for the GDAX API
        oneWeek = new Date(oneWeek).toISOString();
        today = new Date(today).toISOString();

        console.log(oneWeek, today);

        var baseURL = `https://api.gdax.com/products/${currency}/candles?start=${oneWeek}&end=${today}&granularity=86400`;

        console.log(baseURL);

        return fetch(baseURL)
            .then((response) => response.json()).then((data) => {
                return data;
        });
    }

    getAllHistoricalDataForCurrency = (currency) => {
        currency = currency || 'BTC-USD';

        const baseURL = `https://api.gdax.com/products/${currency}/candles`;

        return fetch(baseURL)
            .then((response) => response.json()).then((data) => {
                return data;
        });
    }

    calculatePercentageChange = (price, currencyString) => {
        
        if (!price) {
            throw new Error("You must provide a price to calculate % change!");
        }

        currencyString = currencyString || 'BTC-USD';

        var _currentPrice = price,
            _percentChange;

        return getDailyHistoricalDataForCurrency(currencyString).then((data) => {
            data.percent_change = 0.0;
            return data;
        });
    }

    getRandomUnsplashPhoto = () => {

        const CLIENT_ID = '0c0df6769c35431c409dc7597926f7418bf9d0fdbc72c3d3e640181b8332dea5';
        const _unsplashURL = `https://api.unsplash.com/photos/random?client_id=${CLIENT_ID}&query=nature`;

        return fetch(_unsplashURL)
            .then((response) => response.json()).then((data) => {
                return data;
            });
    };

    buildUI = () => {
        getCurrentPriceForCurrency('BTC-USD').then((data) => {
                var $status = document.querySelector('.status__status--btc'),
                $price = document.querySelector('.status__price--btc');
            
            $price.innerHTML = data.data.amount;
        });

        getCurrentPriceForCurrency('ETH-USD').then((data) => {
            var _status = document.querySelector('.status__status--eth'),
                _price = document.querySelector('.status__price--eth');

            _price.innerHTML = data.data.amount;
        });
           
        getCurrentPriceForCurrency('LTC-USD').then((data) => {
                var _status = document.querySelector('.status__status--ltc'),
                _price = document.querySelector('.status__price--ltc');

            _price.innerHTML = data.data.amount;
        });
    }

    // Animate the progress bar
    animateProgress = () => {
        const _progressIndicator = document.querySelector('.progress');
        _progressIndicator.style.width = animationWidth + '%'
        animationWidth++;

        if (animationWidth === 100) {
            animationWidth = 0;
        }
    }

    checkForCachedImage = () => {
        // Elements
        $bgImage     = document.querySelector('.bg__image');
        $authorName  = document.querySelector('.unsplash__author__name');
        $authorImage = document.querySelector('.unsplash__author__image');

        // Get the local storage object if it exists
        var bgImage = localStorage.getItem('unsplash_data_obj');
        var timeToExpire = localStorage.getItem('unsplash_data_time_expiry')

        // UTM params for Unsplash
        const UTMParams = '?utm_source=CRYPTEX&utm_medium=referral&utm_campaign=api-credit';

        var d = new Date(),
            now = Date.now(),
            addTwoHours = now + TWO_HOURS;

        console.log(now, addTwoHours);

        if (!bgImage || now > timeToExpire)   {
            getRandomUnsplashPhoto().then((data) => {

                console.log($bgImage);

                var backgroundImageUrl = data.urls.regular;
                
                console.log(data);
                
                $bgImage.style.backgroundImage = `url(${data.urls.regular})`;
                $authorImage.setAttribute('src', data.user.profile_image.large);
                $authorName.setAttribute('href', data.user.links.html + UTMParams);
                $authorName.innerHTML = data.user.name;

                // Build an object to store in local storage
                var backgroundImageData = {
                    user_name: data.user.name,
                    user_profile_url: data.user.links.html,
                    user_profile_image_url: data.user.profile_image.large,
                    background_image: data.urls.regular
                };
                

                // Set the stringified localStorage obj
                localStorage.setItem('unsplash_data_obj', JSON.stringify(backgroundImageData));
                localStorage.setItem('unsplash_data_time_expiry', addTwoHours);
            });
        } else {
            var completeObj = JSON.parse(bgImage);

            $bgImage.style.backgroundImage = `url(${completeObj.background_image})`;
            $authorImage.setAttribute('src', completeObj.user_profile_image_url);
            $authorName.setAttribute('href', completeObj.user_profile_url + UTMParams);
            $authorName.innerHTML = completeObj.user_name;
        }
    }

    toggleMenu = () => {
        const _$settingsMenu = document.querySelector('.settings__menu');
        const _$settingsCheckbox = document.querySelector('.settings__checkbox');

        var _lsObj = localStorage.getItem('use_unsplash');

        if (_lsObj === 'true') {
            _$settingsCheckbox.checked = true;
        } else {
            _$settingsCheckbox.checked = false;
        }

        _getCheckboxValue = (event) => {
            var _bool = event.target.checked;
        
            if (_bool) {
                if (_lsObj) {
                    localStorage.removeItem('use_unsplash');
                }

                // Update LS
                localStorage.setItem('use_unsplash', true);

                // Hide the menu and reload the page
                _$settingsMenu.classList.remove('active');
                window.location.reload(true);

                // Get a new image and load Unsplash UI
                checkForCachedImage();
                $unsplashUI.style.display = 'block';
            } else {
                if (_lsObj) {
                    localStorage.removeItem('use_unsplash');

                    // Hide the menu and reload the page
                    _$settingsMenu.classList.remove('active');
                    window.location.reload(true);
                }
                // Update LS
                localStorage.setItem('use_unsplash', false);
            }
            
        }

        _$settingsMenu.onchange=_getCheckboxValue;
        _$settingsMenu.classList.add('active');
    }

    $settingsBtn.addEventListener('click', () => {
        const _$settingsMenu = document.querySelector('.settings__menu');

        settingsOpen = !settingsOpen;

        if (settingsOpen) {
            $settingsBtn.classList.add('active');
            toggleMenu();
        } else {
            settingsOpen = false;
            $settingsBtn.classList.remove('active');
            _$settingsMenu.classList.remove('active');
        }        
    });
    

    setInterval(() => {
        animateProgress();
    }, 100);

    setInterval(() => {
        buildUI();
    }, UPDATE_INTERVAL * ONE_SECOND);
    
    if (useUnsplashBackground === 'true') {
        checkForCachedImage();
        $unsplashUI.style.display = 'block';
    } else {
        $unsplashUI.style.display = 'none';
        _$htmlBody = document.querySelector('body');
    }

    buildUI();
})();

// Open Cryptex when the extension icon is clicked
chrome.browserAction.onClicked.addListener(function (activeTab) {

    if (activeTab.title !== "cryptex") {
        chrome.tabs.create({ url: chrome.runtime.getURL("cryptex.html")});
    } else {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {

                if (tab.title === "cryptex") {
                    console.log(tab.id, tab.index);
                    chrome.tabs.update(tab.id, { highlighted: false });
                }
            });
        });
    }
});