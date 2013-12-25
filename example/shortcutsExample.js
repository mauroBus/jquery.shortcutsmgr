/*
 *  Shortcut Manager Example
 *
 * This is an example of the Shortcut Manager Library.
 * This example is composed by a set of shortcuts regions with handlers for some key events.
 */

/******************************************************
 * Instantiating the Shortcut Manager
 ******************************************************/
var shortcutsMgr = new $.ShortcutsMgr({
  selectionClass: 'selectedRegion'
});

var region1Name = 'myFirstRegion';
var region2Name = 'mySecondRegion';
var region3Name = 'myThirdRegion';
var region4Name = 'myForthRegion';

var $activationLabel = $('.activation-label');
var $activeRegionName = $('.active-region-name');
var $regionActivatedTag = $('.region-activated-tag');



// displays a message when an event is caugth
var alertEventCaugth = function(msg) {
  var finalMsg = msg || 'Select a region...';
  $regionActivatedTag.text(finalMsg);
};

var alertRegionActive = function(regionName) {
  $activeRegionName.text(regionName);
};

var alertActivationLabel = function(msg) {
  $activationLabel
    .text(msg)
    .css("transition","all 0.3s ease")
    .queue( function(next) {
      $(this).css({
        'background-color': 'orange'
      });
      next();
    })
    .delay(300)
    .queue( function(next){
      $(this).css({
        'background-color': ''
      });
      next();
    });
};



/******************************************************
 * Instantiating the Shortcut Regions
 ******************************************************/

// Creating Region #1
var region1 = shortcutsMgr.addRegion({
  name: region1Name,
  regionEl: '#region1',
  autoActivateEvent: 'click',
  onEnterRegion: function() {
    alertRegionActive('Region 1');
    alertEventCaugth('This Region Listen for Ctrl+Down and Ctrl+Up Events');
  },
  onExitRegion: function() {
    alertRegionActive('Region 1 No Longer Active');
    alertActivationLabel('');
    alertEventCaugth('');
  },
  events: [
    {
      types: 'keydown',
      keys: 'ctrl+down',
      handler: function() {
        alertActivationLabel('region 1 [ctrl+down] event caugth');
        return false;
      }
    },
    {
      types: 'keydown',
      keys: 'ctrl+up',
      handler: function() {
        alertActivationLabel('region 1 [ctrl+up] event caugth');
        return false;
      }
    }
  ]
});

// Creating Region #2
var region2 = shortcutsMgr.addRegion({
  name: region2Name,
  regionEl: '#region2',
  autoActivateEvent: 'mouseover',
  onEnterRegion: function() {
    alertRegionActive('Region 2');
    alertEventCaugth('This Region Listen for Ctrl+Right and Ctrl+Left Events');
  },
  onExitRegion: function() {
    alertRegionActive('Region 2 No Longer Active');
    alertActivationLabel('');
    alertEventCaugth('');
  },
  events: [
    {
      types: 'keydown',
      keys: 'ctrl+right',
      handler: function() {
        alertActivationLabel('region 1 [ctrl+right] event caugth');
        return false;
      }
    },
    {
      types: 'keydown',
      keys: 'ctrl+left',
      handler: function() {
        alertActivationLabel('region 1 [ctrl+left] event caugth');
        return false;
      }
    }
  ]
});

// Creating Region #3
var region3 = shortcutsMgr.addRegion({
  name: region3Name,
  regionEl: '#region3',
  autoActivateEvent: 'dblclick',
  onEnterRegion: function() {
    alertRegionActive('Region 3');
    alertEventCaugth('This Region Listen for Return (Enter) Events');
  },
  onExitRegion: function() {
    alertRegionActive('Region 3 No Longer Active');
    alertActivationLabel('');
    alertEventCaugth('');
  },
  events: [
    {
      types: 'keydown',
      keys: 'return',
      handler: function() {
        alertActivationLabel('region 3 [return] event caugth');
        return false;
      }
    }
  ]
});

// Creating Region #4
var region4 = shortcutsMgr.addRegion({
  name: region4Name,
  regionEl: '#region4',
  autoActivateEvent: 'mouseleave',
  onEnterRegion: function() {
    alertRegionActive('Region 4');
    alertEventCaugth('This Region Listen for Tab Events');
  },
  onExitRegion: function() {
    alertRegionActive('Region 4 No Longer Active');
    alertActivationLabel('');
    alertEventCaugth('');
  },
  events: [
    {
      types: 'keydown',
      keys: 'tab',
      handler: function() {
        alertActivationLabel('region 4 [tab] event caugth');
        return false;
      }
    }
  ]
});



/******************************************************
 * Applying the buttons bindings
 ******************************************************/

$('#startRegionMgr').on('click', function() {
  shortcutsMgr.startRegion(region1Name);
});

$('#startNextRegionMgr').on('click', function() {
  shortcutsMgr.startNextRegion();
});

$('#startPrevRegionMgr').on('click', function() {
  shortcutsMgr.startPrevRegion();
});

$('#stopRegionMgr').on('click', function() {
  var activeRegion = shortcutsMgr.getActiveRegion();
  if (activeRegion) {
    shortcutsMgr.stopRegion(activeRegion.name);
  }
});
