function IsEmail(fData){
	  if (!fData){
      return false;
    }//说明fData为空
    if (fData.indexOf("@") == -1){
      return false
    }//说明没有@
    var NameList = fData.split("@");
    if (NameList.length != 2){
      return false
    }//说明只有一个@,因为分割后为两部分
    if (NameList[0].length < 1){
      return false
    }//说明@前没有字符串
    if (NameList[1].indexOf(".") <= 0){
      return false
    }//说明@后.之前没有字符串
    if (fData.indexOf("@") > fData.indexOf(".")) {
      return false
    }//说明.在@之前
    if (fData.indexOf(".") == fData.length - 1){
      return false
    }//说明"."是最后一位
    return true;
};
module.exports = IsEmail;