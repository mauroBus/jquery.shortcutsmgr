/*
 * Require and initialise PhantomCSS module
 * Paths are relative to CasperJs directory
 */
var phantomcss = require('./phantomcss/phantomcss.js');

phantomcss.init({
  screenshotRoot: './test-results/screenshots',
  failedComparisonsRoot: './test-results/failures'
// casper: specific_instance_of_casper,
// libraryRoot: '/phantomcss',
// fileNameGetter: function overide_file_naming(){},
// onPass: function passCallback(){},
// onFail: function failCallback(){},
// onTimeout: function timeoutCallback(){},
// onComplete: function completeCallback(){},
// hideElements: '#thing.selector',
// addLabelToFailedImage: true
});


/*
The test scenario
*/
casper.start( 'http://localhost/jquery.shortcutsmgr/example/' );

casper.viewport(1024, 768);

casper.then(function() {
  phantomcss.screenshot('body', 'Shortcuts manager initial screenshot');
});

// first test
casper.then(function() {
  casper.click('#startRegionMgr');

  // wait for the selection of the first region
  casper.waitForSelector(
    '#region1.selectedRegion',
    function success() {
      phantomcss.screenshot('body', 'Starting First Region');
    },
    function timeout() {
      casper.test.fail('Should see the first region highlighted');
    }
  );
});

// second test
casper.then(function() {
  casper.click('#startNextRegionMgr');

  // wait for the selection of the 2nd region
  casper.waitForSelector(
    '#region2.selectedRegion',
    function success() {
      phantomcss.screenshot('body', 'Starting Second Region');
    },
    function timeout() {
      casper.test.fail('Should see the second region highlighted');
    }
  );
});


// third test
casper.then(function() {
  // selecting the third region.
  casper.click('#startNextRegionMgr');

  // triggers and 'enter' event.
  var event = document.createEvent('Events');
  event.initEvent('keydown', true, true);
  event.keyCode = 13;
  event.which = 13;
  document.dispatchEvent(event);

  casper.wait(
    300, //'.activation-label',
    function success() {
      phantomcss.screenshot('body', 'enter pressed');
    },
    function timeout() {
      casper.test.fail('Should catch the enter keys');
    }
  );
});


// fouth test
casper.then(function() {
  // selecting back the 2nd region.
  casper.click('#startPrevRegionMgr');

  casper.waitForSelector(
    '#region2.selectedRegion',
    function success() {
      phantomcss.screenshot('body', 'Starting Back Second Region');
    },
    function timeout() {
      casper.test.fail('Should see the second region highlighted again');
    }
  );
});

casper.then( function now_check_the_screenshots(){
  // compare screenshots
  phantomcss.compareAll();
});

casper.then( function end_it(){
  casper.test.done();
});

/*
Casper runs tests
*/
casper.run(function(){
  console.log('\nTHE END.');
  phantom.exit(phantomcss.getExitStatus());
});
