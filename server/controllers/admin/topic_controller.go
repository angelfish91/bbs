package admin

import (
	"strconv"

	"github.com/kataras/iris"
	"github.com/mlogclub/bbs-go/controllers/render"
	"github.com/mlogclub/bbs-go/model"
	"github.com/mlogclub/bbs-go/services"
	"github.com/mlogclub/simple"
)

type TopicController struct {
	Ctx iris.Context
}

func (this *TopicController) GetBy(id int64) *simple.JsonResult {
	t := services.TopicService.Get(id)
	if t == nil {
		return simple.JsonErrorMsg("Not found, id=" + strconv.FormatInt(id, 10))
	}
	return simple.JsonData(t)
}

func (this *TopicController) AnyList() *simple.JsonResult {
	list, paging := services.TopicService.Query(simple.NewParamQueries(this.Ctx).
		EqAuto("id").EqAuto("user_id").EqAuto("status").LikeAuto("title").PageAuto().Desc("id"))

	var results []map[string]interface{}
	for _, topic := range list {
		builder := simple.NewRspBuilderExcludes(topic, "content")

		// 用户
		builder = builder.Put("user", render.BuildUserDefaultIfNull(topic.UserId))

		// 简介
		mr := simple.NewMd().Run(topic.Content)
		builder.Put("summary", mr.SummaryText)

		// 标签
		tags := services.TopicService.GetTopicTags(topic.Id)
		builder.Put("tags", render.BuildTags(tags))

		results = append(results, builder.Build())
	}

	return simple.JsonData(&simple.PageResult{Results: results, Page: paging})

}

// 获得指定tagid下的topic
func (this *TopicController) AnyLists() *simple.JsonResult {
	tagID := simple.FormValue(this.Ctx, "tagid")
	page := simple.FormValue(this.Ctx, "page")
	tagIDn, _ := strconv.ParseInt(tagID, 10, 64)
	pageN, _ := strconv.Atoi(page)
	list, paging := services.TopicService.GetTagTopics(tagIDn, pageN)

	var results []map[string]interface{}
	for _, topic := range list {
		builder := simple.NewRspBuilderExcludes(topic, "content")

		// 用户
		builder = builder.Put("user", render.BuildUserDefaultIfNull(topic.UserId))

		// 简介
		mr := simple.NewMd().Run(topic.Content)
		builder.Put("summary", mr.SummaryText)

		// 标签
		tags := services.TopicService.GetTopicTags(topic.Id)
		builder.Put("tags", render.BuildTags(tags))

		results = append(results, builder.Build())
	}

	return simple.JsonData(&simple.PageResult{Results: results, Page: paging})
}

func (this *TopicController) PostCreate() *simple.JsonResult {
	t := &model.Topic{}
	err := this.Ctx.ReadForm(t)
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}

	err = services.TopicService.Create(t)
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}
	return simple.JsonData(t)
}

func (this *TopicController) PostUpdate() *simple.JsonResult {
	id, err := simple.FormValueInt64(this.Ctx, "id")
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}
	t := services.TopicService.Get(id)
	if t == nil {
		return simple.JsonErrorMsg("entity not found")
	}

	err = this.Ctx.ReadForm(t)
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}

	err = services.TopicService.Update(t)
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}
	return simple.JsonData(t)
}

func (this *TopicController) PostDelete() *simple.JsonResult {
	id, err := simple.FormValueInt64(this.Ctx, "id")
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}

	err = services.TopicService.Delete(id)
	if err != nil {
		return simple.JsonErrorMsg(err.Error())
	}
	return simple.JsonSuccess()
}
