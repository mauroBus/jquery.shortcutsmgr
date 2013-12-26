jquery.shortcutsmgr
===================

A simple jQuery plugin for the management of handlers for keyboard events associated to several DOM regions.

This plugin depends on:
* [jQuery](http://jquery.com)
* [Class](http://ejohn.org/blog/simple-javascript-inheritance/)
* [Hotkeys](https://github.com/jeresig/jquery.hotkeys)


## About

This plugin is composed by a Shortcut Manager (`ShortcutsMgr`) that manage a set of Shortcut Regions. Basically, `ShortcutsMgr` allows to add, remove, activate and deactivate regions. Each region is associated with a particular DOM element and, when the region is active, it listen for a set of keyboard events associating callbacks for each of them. For the callbacks listening it is used *Hotkeys* library. At a given time, only one Shortcut Region can be activated per Shortcut Manager instance, when starting other Shortcut Region, the previous region is unplugged and it stops listening its own key events.


## Installation

Include script *after* the jQuery library, the Class library and the Hotkeys library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.js"></script>
<script src="/path/to/class.js"></script>
<script src="/path/to/hotkeys.js"></script>
<script src="/path/to/shortcutsmgr.js"></script>
```

The plugin can also be loaded as AMD module.


## Basic Usage

Create a new Shortcut Manager instance:

```javascript
var shortcutsMgr = new $.ShortcutsMgr();
// or
var shortcutsMgr = new $.ShortcutsMgr({
  selectionClass: 'some-class-name' [optional]
});
```

Creating a Shortcut Region for the '#region1' DOM's element:

```javascript
var region1 = shortcutsMgr.addRegion({
  name: 'some-unique-region-name',  // it must be unique for every Shortcut Manager instance.
  regionEl: '#region1',             // the DOM region to apply the keyboard bindings.
  autoActivateEvent: 'click',       // [optional] the jquery event to manually activates the region.
  onEnterRegion: function() {       // callback executed when the region is activated.
    alert('region 1 keyboard events are being activated');
  },
  onExitRegion: function() {        // callback executed when the region is deactivated.
    alert('region 1 keyboard events are being deactivated');
  },
  events: [                         // keyboard event list. 
    {
      types: 'keydown',             // keyboard event type.
      keys: 'ctrl+down',            // keyboard event.
      handler: function() {         // callback executed when the keyboard event is fired.
        alert('ctrl+down pressed!');
        return false;               // returns false when avoiding browser defaults.
      }
    },
    ...
  ]
});
```

Start an existing Shortcut Region:

```javascript
shortcutsMgr.startRegion('some-unique-region-name');
```
it plug the region's keyboard events.


Start the next Shortcut Manager region in its region list:

```javascript
shortcutsMgr.startNextRegion();
```

Start the previous Shortcut Manager region in its region list:

```javascript
shortcutsMgr.startPrevRegion();
```


Get the current active region in the Shortcut Manager:

```javascript
shortcutsMgr.getActiveRegion();
```


Stop the current active region in the Shortcut Manager:

```javascript
var activeRegion = shortcutsMgr.getActiveRegion();
shortcutsMgr.stopRegion('some-unique-region-name');
```


Removing a given Shortcut Manager region:

```javascript
shortcutsMgr.removeRegion('some-unique-region-name');
```


> *Note: At a given time, only one Shortcut Region can be activated per Shortcut Manager instance.*


## Shortcut Manager Options

When instanciating a Shortcut Manager, a set of parameters could be given. That parameters are listed below.

### Class to apply to the main DOM element selected region
By adding the parameter `selectionClass` at instantiation time it is possible to add a class name to apply to the DOM's element of the active region. By default, the class name is 'highlighted-region'.
Example: `new $.ShortcutsMgr({ selectionClass: 'a-selected-region-class' });`


## Shortcut Region Options
Next, the Shortcut Region parameters are listed:

* name: The Shortcut Region Name. It must be unique for a Shortcut Manager instance.
* events: This is an event list. Each event is an Object composed by three elements:
  + types: Supported types are 'keydown', 'keyup' and 'keypress'.
  + keys: a keyboard event list (String) separated by space.
  + handler: the keyboard handler function.
* regionEl: The main DOM's element selector for the region.
* enableInInput: [true | false] This allows apply the bindings inside the inputs. By default this is `false`.
* selectionClass: The class name to be applied to the region's DOM when the region is active and it is listening its shortcuts.
* autoActivateEvent: [String] This is an event to manually active the region. The posibilities are:
	 `blur, focus, focusin, focusout, load, resize, scroll, unload, click, dblclick, mousedown,
    mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select,
    submit, keydown, keypress, keyup, error, etc`
* onEnterRegion: Callback executed when the region is being plugged (activated).
* onExitRegion: Callback executed when the region is being un-plugged (deactivated).

## Authors

[Mauro Buselli](https://github.com/mauroBus)
