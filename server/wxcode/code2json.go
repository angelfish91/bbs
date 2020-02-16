package wxcode

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

const (
	APPID string = "wxac584c9522eb9189"
	SECRET string = "cf182ec6b5d59fda6e6e7e99c9af6d5d"
)

func GetWxUserIdentity(jsCode string) string {
	url := fmt.Sprintf("https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code", APPID, SECRET, jsCode)
	response, err := http.Get(url)
	if err != nil {
		// handle error
	}
	//程序在使用完回复后必须关闭回复的主体。
	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)
	fmt.Println("[DEBUG] jscode2session\t", string(body))
	return string(body)
}