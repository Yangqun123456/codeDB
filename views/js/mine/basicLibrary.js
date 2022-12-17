export function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

export function alertmess(mess) {
    $('#alertmess').html(mess); // 填入要显示的文字
    $('#alertmess').show(); // 显示弹框
    return new Promise((resolve, reject) => {
        setTimeout(() => { // 倒计时
            $('#alertmess').html(''); // 清空文本
            $('#alertmess').hide(); // 隐藏弹框
            resolve()
        }, 5000); // 5秒
    })
}

export function getLabelClass(labelState) {
    if (labelState == "issue") return "label label-info";
    else if (labelState == "Purchased" || labelState == "resale") return "label label-warning";
    else if (labelState == "redeem") return "label label-success";
}

export function enState_To_zhStates(enState) {
    if (enState == "issue") return "发行";
    else if (enState == "Purchased" || enState == "resale") return "购买";
    else if (enState == "redeem") return "兑换";
}

export function zhState_To_enStates(zhState) {
    if (zhState == "发行") return "issue";
    else if (zhState == "购买") return "Purchased";
    else if (zhState == "兑换") return "redeem";
}

export function ignoreErrorAttr(obj, search = "", re = 0) {
    const arr = search.split(".");
    if (!obj) {
        return re;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf("[") >= 0 && arr[i].indexOf("]") >= 0) {
            let index = arr[i].split("[")[1].split("]")[0]
            obj = obj[index];
        } else {
            obj = obj[arr[i]];
        }
        if (obj === undefined) {
            return re;
        }
    }
    return obj;
}

export function isDuringDate(beginDateStr, endDateStr) {
    var curDate = new Date(),
        beginDate = new Date(beginDateStr),
        endDate = new Date(endDateStr);
    if (curDate >= beginDate && curDate <= endDate) {
        return true;
    }
    return false;
}

export function updateWebsiteHref(username) {
    $('#icon-user').html("<i class='icon-user'></i>" + username + "<b class='caret'></b>");
    $("a[href='../mainpage.html']").attr('href', '../mainpage?username=' + username);
    $("a[href='../profile.html']").attr('href', '../profile?username=' + username);
    $("a[href='../issue.html']").attr('href', '../issue?username=' + username);
    $("a[href='../buy.html']").attr('href', '../buy?username=' + username);
    $("a[href='../issuePapers.html']").attr('href', '../issuePapers?username=' + username);
    $("a[href='../buyPapers.html']").attr('href', '../buyPapers?username=' + username);
    $("a[href='../redeemPapers.html']").attr('href', '../redeemPapers?username=' + username);
    $("a[href='../addcredit.html']").attr('href', '../addcredit?username=' + username);
}