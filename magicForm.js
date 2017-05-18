/**
 * 【作者】争鸣
 * 【联系】whb883@sina.com
 * 【功能】:增加 统一按钮生效/禁用 写法
 * 【示例】: 生效: $(".example").effect();
 * 		   禁用: $(".example").uneffect();
 */
(function(jq) {
	jq.fn.uneffect = function() {
		$(this).attr("disabled", true);
		$(this).removeClass("blue_btn_bg").addClass("gray_bg_btn");
	};
	jq.fn.effect = function() {
		$(this).attr("disabled", false);
		$(this).removeClass("gray_bg_btn").addClass("blue_btn_bg");
	};
})(jQuery);

/**
 * 【作者】争鸣
 * 【联系】whb883@sina.com
 * 【功能】:增加 去除disabled/重置 公共方法 写法(一般用于form提交)
 * 【参数】: include/exclude 是指元素的name属性值
 * 【示例】: 添加 $(".example").addDisable();
 * 		   去除 $(".example").removeDisable();
 * 		   重置 $(".example").resetDisable();
 */
(function ($) {
    $.fn.extend({
    	"batchDisable": function (type) {
    		this.each(function(i,v){
    			if('add' == type) {
    				$(this).attr("back-disabled","add");
    				$(this).attr("disabled","disabled");
    				console.log("addDisable-:"+$(this).attr("name"));
    			}else {
    				$(this).attr("back-disabled","remove");
    				$(this).removeAttr("disabled");
    				console.log("removeDisable-:"+$(this).attr("name"));
    			}
			});
    	},
    	"addDisable": function () {
    		this.find("select, textarea, input[type='text']").each(function(){
				$(this).attr("back-disabled","add");
				$(this).attr("disabled","disabled");
				console.log("addDisable-:"+$(this).attr("name"));
			});
    	},
    	"removeDisable": function (include, exclude) {
    		var includeArr = eval(include);
    		var excludeArr = eval(exclude);
			this.find("select, textarea, input[type='text']").each(function(){
    			var curName = $(this).attr("name");
    			if($.inArray(curName, includeArr)>=0 && exclude==null) { //只移除include元素 disabled
    				$(this).attr("back-disabled","remove");
    				$(this).removeAttr("disabled");
    				console.log("removeDisable-include:"+curName);
    			}
    			if($.inArray(curName, excludeArr)<0 && include==null) { //排除掉不移除的,其余的都移除disabled
    				$(this).attr("back-disabled","remove");
    				$(this).removeAttr("disabled");
    				console.log("removeDisable-exclude:"+curName);
    			}
			});
    	},
		"resetDisable": function () {
			this.find("select[back-disabled], textarea[back-disabled], input[type='text'][back-disabled]").each(function(){
				if($(this).attr("back-disabled") == 'add') {
					$(this).removeAttr("disabled");
				}else if($(this).attr("back-disabled") == 'remove') {
					$(this).attr("disabled","disabled");
				}
				$(this).removeAttr("back-disabled");
			});
    	}
    	
    });
})(jQuery);

/**
 * 【作者】争鸣
 * 【联系】whb883@sina.com
 * 【功能】:form验证工具
 * 【示例】: 添加 $(".example").formValidate();
 * 		   验证通过true/不通过false 并弹窗错误信息
 * 【属性参数】: data-magicCheck 扫描的验证标识
 * 			  magic-validate-msg 验证不通过，弹框提示内容（可以不指定，则走默认提示，建议根据不同业务场景指定）
 * 			  data-magicCheck-focus 隐藏元素指定焦点元素属性，如果验证元素当前隐藏状态并且无指定焦点元素 则忽略校验
 * 			  data-magicCheck-result 验证结果标识，元素包含此标识 证明验证不通过
 * 【支持验证类型】:necessary/number/decimal/percent/mail/phone/postcode/carnumber/specailchar/not-equal，更多支持正在丰富中~~~
 */
(function(jq) {
	jq.fn.formValidate = function() {
		$('[data-magicCheck]').each(function(){ //首先清空 之前验证标志
			clearCheckFlg($(this));
		});
		
		$('[data-magicCheck]').each(function(){ //当前验证审查
			var _this = $(this);
			var _this_val = _this.val().trim();
			var _this_tagName = _this.prop('tagName');
			var _this_check_type = _this.attr('data-magicCheck');
			if(_this_tagName.toLocaleLowerCase()=='input') {
				console.debug(_this.attr('name')+'magic-validate processing');
				//忽略验证情形过滤-----------
				if(_this.is(':hidden') && !_this.attr('data-magicCheck-focus')) { //元素隐藏 并且 无焦点指向属性 跳过验证
					console.debug(_this.attr('name')+'magic-validate ignore code 1');
					return true;
				}
				//忽略验证情形过滤 结束-------
				
				//验证审查 - 类型区分验证打标
				switch (_this_check_type) {
					case 'necessary':
						if(_this_val == '') {
							checkFalse(_this, '验证失败，请输入必输项');
						}	
						break;
					case 'number':
						if(isNaN(_this_val)) {
							checkFalse(_this, '验证失败，非数字');
						}
						break;
					case 'decimal':
						if(!(dNum.split(".")[0].length < 8 && /^[0-9]+(.[0-9]{1,2})?$/.test(_this_val))) {
							checkFalse(_this, '验证失败，数值不合格规范');
						}
						break;
					case 'percent':
						if(!(/^(([1-9]\d(\.\d{1,2})?)|(0\.(?!0+%$)\d{1,2}))%$/.test(_this_val))) {
							checkFalse(_this, '验证失败，百分数不合格规范');
						}
						break;
					case 'mail':
						if(!(/\w+[@]{1}\w+[.]\w+/.test(_this_val))) {
							checkFalse(_this, '验证失败，邮件不合格规范');
						}
						break;
					case 'phone':
						if(!(/^1[3|4|5|7|8]\d{9}$/.test(_this_val))) { 
							checkFalse(_this, '验证失败，手机号不合格规范');
					    }
						break;
					case 'postcode':
						if(!(/^[0-9]\d{5}$/.test(_this_val))) {
							checkFalse(_this, '验证失败，邮编不合格规范');
						}
						break;
					case 'carnumber':
						if(/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(_this_val)) {
							checkFalse(_this, '验证失败，车牌号不合格规范');
						}
						break;
					case 'specailchar':
						if(/^[\w\s\u2E80-\uFE4F\.]*$/.test(_this_val)) {
							checkFalse(_this, '验证失败，包含特殊字符');
						}
						break;
					case 'not-equal':
						console.debug('验证 分组不等功能 暂未实现，全速补充中···');
						break;
						
					default:
						console.debug('验证类型 暂不支持，如果有强需求请联系作者添加~');
						break;
				}
			}
		});
		
		function checkFalse(_this, errMsg) {
			if(!_this.attr('magic-validate-msg')) { //如果当前magic-validate-msg属性为空(说明用户没有定制，走默认错误信息输出)
				_this.attr('magic-validate-msg', errMsg);
			}
			_this.attr('data-magicCheck-result',false);
		}
		function clearCheckFlg(_this) {
			_this.removeAttr('data-magicCheck-result');
		}
		
		var firstErrObj = $('[magic-validate][data-magicCheck-result]:first');
		if(firstErrObj && firstErrObj.length>0) {
			var err_msg = firstErrObj.attr('magic-validate-msg');
			if(err_msg){ //最后兜底验证是否包含magic-validate-msg
				alert(err_msg);
			}
			else {//兜底alert
				alert('验证失败，请检查！');
			}
			if(firstErrObj.is(':hidden')) { //当前验证元素为隐藏元素，自动定位 预设的焦点元素
				if(firstErrObj.attr('data-magicCheck-focus')) {
					$(firstErrObj.attr('data-magicCheck-focus')).focus();
				}
			} else {
				firstErrObj.focus();
			}
			return false;
		}
		
	};
})(jQuery);