let authority = {};

authority.install = function (Vue, options_plugin) {
    Vue.prototype.hasAuthority = function (funcCode) {
        const btns = this.$store.getters.btns
        for(var i=0;i<btns.length;i++){
            if(funcCode===btns[i]){
                return true
            }
        }
        return false
    }
}

module.exports = authority;