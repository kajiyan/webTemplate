# ============================================================
# INDEX
module.exports = (sn, $, Backbone, _) ->
  class sn.Router extends Backbone.Router
    constructor: (options) ->
      super

      # ルーターで処理する要素
      defaults =
        module: {}
        pages: {}
        popup: {}

      @$window = $(window)
      @$body = $("body")

      @viewPage = null
      @viewAfterPage = null
      @transition = false

    initialize: () ->
      console.log "initialize -> Router"
      @_getElements()

    routes:
      "sample(/)": () ->
        @request "sample"
      "*default": () ->

    setup: () ->
      return $.Deferred (defer) =>
        onDone = =>
          console.log "Router -> setup"
          defer.resolve()

        Backbone.history.start
          pushState: true
          root: SETTING.BASE_PATH

        @_events()

        onDone()
      .promise()

    request: (param) ->
      console.log "Router -> request -> (#{param})"
      @options.pages[param].setup(true)

    popup: (param) ->

    _events: () ->

    _getElements: () ->
      @$els = {}
      return @$els

# URLを切り替える
# @navigate param, trigger: false