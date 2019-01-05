;
(function(pz) {
    pz.supplierdetails = (function() {
        function _SD(o) {
            this.linkParam = pz.geturl()
            this.files = ''
            this.init()
        }
        _SD.prototype.init = function() {

        }

        return {
            init: function(obj) {
                new _SD(obj);
            }
        }
    })()
})(window.pz)