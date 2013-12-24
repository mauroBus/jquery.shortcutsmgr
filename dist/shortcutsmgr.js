/*!
 * jQuery ShortcutMgr Plugin v0.1
 * https://github.com/mauroBus/jquery.shortcutmgr
 *
 * Copyright 2013 Mauro Buselli
 * Released under the MIT license
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(jQuery, Class);
  }
}(function ($, Class) {
  /**
   * Shortcut Manager Class
   */
  var ShortcutsMgr = Class.extend({
    regions: null,
    keys: [],
    key: null,
    selectionClass: null,

    /**
     * initialices the -shortcuts Manager.
     * @params {Object} params object with:
     *  {
     *    selectionClass: the class name to be applied to the selected region.
     *  }
     */
    init: function(params) {
      this.regions = {};
      this.selectionClass = params && params.selectionClass || 'highlighted-region';
    },

    /**
     * Adds a shortcut region to the manager.
     * @param {ShortcutRegion} shortcutRegion either an instance of ShortcutRegion or 
     *  the new shortcut region parameters. In the last case, the ShortcutRegion instance is created.
     */
    addRegion: function(shortcutRegion) {
      var region = shortcutRegion;

      if ( !(shortcutRegion instanceof ShortcutRegion) ) {
        // setting the reference to the Shortcuts Manager
        var extraParams = $.extend(shortcutRegion, {
          shortcutsMgr: this,
          selectionClass: shortcutRegion.selectionClass || this.selectionClass
        });
        // creating the region instance
        region = new ShortcutRegion(extraParams);
      }
      this.regions[region.name] = this.regions[region.name] || {};
      this.regions[region.name] = region;
      this.keys.push(region.name);

      return region;
    },

    /**
     * Removes a shortcut region from the manager
     * @param {String} key the shortcut region name to remove.
     */
    removeRegion: function(key) {
      delete this.regions[key];
      var index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
    },

    /**
     * Starts a given shortcut region by name
     * @param {String} key the ShortcutRegion name.
     */
    startRegion: function(key, ascend, clickedElement) {
      var k, plugged;
      if (!this.regions[key]) return;

      // unplug the last plugged region
      if (this.regions[this.currentKey]) {
        this.regions[this.currentKey].unPlug();
      }

      plugged = this.regions[key].plug(clickedElement);
      
      if (!plugged) {
        var next = ascend ? this.getNextRegion(key) : this.getPrevRegion(key);

        this.startRegion(next, ascend);
      } else {
        this.currentKey = key;
      }
    },

    /**
     * Starts the next shortcut region in the region list.
     * @param {String} key the ShortcutRegion name.
     */
    startNextRegion: function() {
      var region = this.getNextRegion();
      this.startRegion(region, true);
    },

    /**
     * Starts the previous shortcut region in the region list.
     */
    startPrevRegion: function() {
      var region = this.getPrevRegion();
      this.startRegion(region, false);
    },

    /**
     * Stops a given shortcut region in the region list.
     * @param {String} key the ShortcutRegion name.
     */
    stopRegion: function(key) {
      if (this.regions[key]) {
        this.regions[key].unPlug();
      }
    },

    /**
     * Gets the next shortcut region in the region list.
     */
    getNextRegion: function(customKey) {
      var currentKey = customKey ? customKey : this.currentKey;
      for (var i = 0; i <= this.keys.length - 1; i++) {
        if (this.keys[i] === currentKey) {
          return (this.keys[i + 1] === undefined) ? this.keys[0] : this.keys[i + 1];
        }
      }
    },

    getPrevRegion: function(customKey) {
      var currentKey = customKey ? customKey : this.currentKey;
      for (var i = 0; i <= this.keys.length - 1; i++) {
        if (this.keys[i] === currentKey) {
          return (this.keys[i - 1]) ? this.keys[i - 1] : this.keys[this.keys.length - 1];
        }
      }
    },

    getNext: function(key) {
      for (var i = 0; i <= this.keys.length - 1; i++) {
        if (this.keys[i] === key) {
          return (this.keys[++i] === undefined) ? this.keys[0] : this.keys[i];
        }
      }
    },

    /**
     * gets the current activated region.
     */
    getActiveRegion: function() {
      return this.regions[this.currentKey];
    }

  });


  /*
   * Shortcut Region Class
   */
  var ShortcutRegion = Class.extend({
    // defaults definition
    defaults: {
      name: null,             // region name.
      events: [],             // event list.
      regionEl: null,         // region DOM element selector.
      activated: false,       // indicates if this region is plugged, intended to be private.
      enableInInput: false,   // enable shortcut management inside inputs - by default false -
      $inputs: null,          // chatching the inputs inside the region's $el.
      shortcutsMgr: null,     // the Shortcut Manager of this region.
      selectionClass: null,   // class to add to the regionEl when selected.
      autoActivateEvent: null // the event (ej: click) to activate the region other than programaticaly.
    },

    /**
     * initialization
     */
    init: function(params) {
      $.extend(this, this.defaults, params);

      this.onEnterRegion = (params.onEnterRegion && $.isFunction(params.onEnterRegion)) ? params.onEnterRegion : this.onEnterRegion;
      this.onExitRegion = (params.onExitRegion && $.isFunction(params.onExitRegion)) ? params.onExitRegion : this.onExitRegion;
      if (this.enableInInput) {
        this.$inputs = $(this.regionEl + ' input');
      }

      this.bindActivateRegion();
    },

    /**
     * adds a keyboard event to the region.
     */
    addEvent: function(e) {
      this.events.push(e);
    },

    /**
     * adds a keyboard event list to the region. 
     */
    addEvents: function(evs) {
      var e;
      for (e in evs) {
        this.addEvent(e);
      }
    },

    /**
     * activates the region shorcuts bindings
     */
    plug: function(clickedElement) {
      if (!$(this.regionEl).length) {
        return false; // the region is not in the DOM. Plug error.
      }

      this.activated = true;
      var e, keys;

      for (e in this.events) {
        $(document).bind(this.events[e].types, this.events[e].keys, this.events[e].handler);

        if (this.enableInInput) {
          keys = this.events[e].keys;
          if (_.indexOf(keys, 'space') < 0 && _.indexOf(keys, 'return') < 0) {
            this.$inputs.bind(this.events[e].types, this.events[e].keys, this.events[e].handler);
          }
        }
      }

      this.onEnterRegion(clickedElement);
      $(this.regionEl).addClass(this.selectionClass);
      return true; // successfuly plugged in
    },

    /**
     * deactivates the region shorcuts bindings
     */
    unPlug: function() {
      this.activated = false;
      var e;

      for (e in this.events) {

        // Makes sure only keypress events are unbound.
        if (this.events[e].types) {
          $(document).unbind(this.events[e].types, this.events[e].handler);
          if (this.enableInInput) {
            this.$inputs.unbind(this.events[e].types, this.events[e].handler);
          }
        }

      }
      $(this.regionEl).removeClass(this.selectionClass);
      this.onExitRegion();
    },

    /**
     * applies the binding to activate this region when the 'autoActivateEvent' occurs.
     */
    bindActivateRegion: function() {
      if (this.regionEl && this.autoActivateEvent) {
        var that = this;
        // at the initialization time, the DOM must be ready
        $(document).ready(function() {
          $(that.regionEl).on(that.autoActivateEvent, that.activateRegion.bind(that));
        });
      }
    },

    /**
     * activates this region.
     */
    activateRegion: function(element) {
      if (!this.activated) {
        this.shortcutsMgr.startRegion(this.name, false, element.target);
      }
    },

    /**
     * callback executed when the region is being plugged (activated)
     */
    onEnterRegion: function() {},

    /**
     * callback executed when the region is being un-plugged (deactivated)
     */
    onExitRegion: function() {}
  });

  $.ShortcutsMgr = ShortcutsMgr;

}));
