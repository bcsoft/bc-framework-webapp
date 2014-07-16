/**
 * 表单模块通用API
 */
bc.namespace("bc.form");

/**
 * 升级创建新版本
 * @param {Object} option 配置参数
 * @option {Integer} id 要升级的表单ID
 * @option {Function} onOk 【可选】升级成功的回调函数
 *
 */
bc.form.upgrade = function(option){
    $.ajax({
        method: "POST",
        dataType: "json",
        url: bc.root + "/form/upgrade",
        data: {id: option.id},
        success: function(json){
            if(typeof option.onOk == "function"){
                option.onOk.call(this, json);
            }
        }
    });
};

