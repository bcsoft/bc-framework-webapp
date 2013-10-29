bc.namespace("bc.photo");
bc.photo = {
    image: {},
    /** 初始化 */
    init: function () {
        // 浏览器支持检测
        if (!window.FileReader) {
            alert("你的浏览器不支持window.FileReader接口，无法处理！");
            return;
        }

        bc.photo.image = {
            type: "png",
            name: "bc",
            data: "data:image/png;base64,0"
        };

        var $form = $(this);
        var $displayContainer = $form.find("#displayContainer");
        var $imgDisplayer = $form.find("#imgDisplayer");
        var $imgProxy = $form.find("#imgProxy");
        $imgProxy.attr("src", $imgDisplayer.attr("src"));

        // 窗口大小变动后重新处理显示区的缩放
        $form.on("dialogresize", function (e, ui) {
            bc.photo.resize.call($form, $displayContainer, $imgDisplayer, $imgProxy);
        });
        $form.trigger("dialogresize");

        // 支持文件拖动的处理
        $displayContainer.on({
            dragover: function(e){
                e.stopPropagation();
                e.preventDefault();//取消默认浏览器拖拽效果
                console.log("dragover");
            },
            drop: function(e){
                e.stopPropagation();
                e.preventDefault();//取消默认浏览器拖拽效果
                console.log("drop");
                //console.log(e.originalEvent.dataTransfer);
                //获取文件对象: TODO 多文件的处理
                var file = e.originalEvent.dataTransfer.files[0];
                bc.photo.showImage($imgProxy, file);
                $displayContainer.css("border","0");
            }
        });

        // 根据图片的实际大小调整显示区，保证图片整张显示
        $imgProxy.on("load", function (e) {
            $imgDisplayer.attr("src", $imgProxy.attr("src"));
            bc.photo.resize.call($form, $displayContainer, $imgDisplayer, $imgProxy);
        });

        // 底部工具条容器
        var $tb = $form.closest(".ui-dialog").find(".ui-dialog-buttonpane");
        // 打开图片事件
        $tb.find("#openImageBtn>span.ui-button-text").html('<div'
            + ' style="position:relative;width:100%;height:100%;white-space:nowrap;">打开图片'
            + '<input type="file" class="uploadFile" name="uploadFile" title="打开图片" multiple="true"'
            + ' style="position:absolute;left:0;top:0;width:100%;height:100%;filter:alpha(opacity=10);opacity:0;cursor:pointer;"/>'
            + '</div>');
        $tb.find(":file.uploadFile").change(function (e) {
            // 判断是否选中文件：如果曾经选中过文件，再打开对话框选择"取消"按钮，change事件也会执行
            if (!this.files || this.files.length == 0) {
                console.log("no file selected");
                return false;
            }

            // 判断文件类型：只支持png、jpg格式
            for (var i = 0; i < this.files.length; i++) {
                //console.log(this.files[i]);
                var index = this.files[i].name.lastIndexOf(".");
                var type = "";
                if (index != -1) {
                    type = this.files[i].name.substr(index + 1);
                }
                type = type.toLowerCase();
                if (type != "png" && type != "jpg") {
                    alert("只能打开 png 或 jpg 格式的图片！");
                    return false;
                }
            }

            // 显示图片：TODO 多选的处理
            var file = this.files[0];
            bc.photo.showImage($imgProxy, file);
        });
    },
    /** 显示指定的文件 */
    showImage: function($imgProxy, file){
        var reader = new window.FileReader();
        bc.photo.image.type = file.name.substr(file.name.lastIndexOf(".") + 1);
        bc.photo.image.name = file.name.substring(0, file.name.lastIndexOf("."));
        reader.onload = function (e) {
            //console.log(e.target.result);
            // 将图片数据加载到图片代理控件
            $imgProxy.attr("src", e.target.result);
            bc.photo.image.data = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    /** 重新处理显示区的缩放 */
    resize: function ($displayContainer, $imgDisplayer, $imgProxy) {
        //console.log("todo:resize");
        var iw = $imgProxy[0].width;
        var ih = $imgProxy[0].height;
        var iwh = iw / ih;// 图片的实际宽高比
        var cw = $displayContainer[0].clientWidth;
        var ch = $displayContainer[0].clientHeight;
        var cwh = cw / ch;// 显示区的宽高比
        //console.log(iw + "/" + ih + "=" + iwh + ", " + cw + "/" + ch + "=" + cwh);
        var sw, sh, padding = 20;
        if (iwh < cwh) {//  限定高度，宽度自由缩放
            $imgDisplayer.css({
                width: "auto",
                height: ch - padding + "px"
            });
        } else {// 限定宽度，高度自由缩放
            $imgDisplayer.css({
                width: cw - padding + "px",
                height: "auto"
            });
        }
    },

    /** 完成 */
    ok: function () {
        //alert("todo:ok");
        var $form = $(this);
    },

    /** 拍照 */
    captureCamera: function () {
        alert("todo:captureCamera");
    },

    /** 下载 */
    download: function () {
        var $form = $(this);

        // 将mime-type改为image/octet-stream，强制让浏览器直接download
        var imageData = bc.photo.image.data.replace('image/'+bc.photo.image.type,'image/octet-stream');
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = imageData;
        save_link.download = bc.photo.image.name + "." + bc.photo.image.type;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }
};