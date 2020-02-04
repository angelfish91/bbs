package repositories

import (
	"github.com/jinzhu/gorm"
	"github.com/mlogclub/bbs-go/model"
	"github.com/mlogclub/simple"
)

var ArticleTagRepository = newArticleTagRepository()

func newArticleTagRepository() *articleTagRepository {
	return &articleTagRepository{}
}

type articleTagRepository struct {
}

func (this *articleTagRepository) Get(db *gorm.DB, id int64) *model.ArticleTag {
	ret := &model.ArticleTag{}
	if err := db.First(ret, "id = ?", id).Error; err != nil {
		return nil
	}
	return ret
}

func (this *articleTagRepository) Take(db *gorm.DB, where ...interface{}) *model.ArticleTag {
	ret := &model.ArticleTag{}
	if err := db.Take(ret, where...).Error; err != nil {
		return nil
	}
	return ret
}

func (this *articleTagRepository) QueryCnd(db *gorm.DB, cnd *simple.QueryCnd) (list []model.ArticleTag, err error) {
	err = cnd.DoQuery(db).Find(&list).Error
	return
}

func (this *articleTagRepository) Query(db *gorm.DB, queries *simple.ParamQueries) (list []model.ArticleTag, paging *simple.Paging) {
	queries.StartQuery(db).Find(&list)
	queries.StartCount(db).Model(&model.ArticleTag{}).Count(&queries.Paging.Total)
	paging = queries.Paging
	return
}

func (this *articleTagRepository) Create(db *gorm.DB, t *model.ArticleTag) (err error) {
	err = db.Create(t).Error
	return
}

func (this *articleTagRepository) Update(db *gorm.DB, t *model.ArticleTag) (err error) {
	err = db.Save(t).Error
	return
}

func (this *articleTagRepository) Updates(db *gorm.DB, id int64, columns map[string]interface{}) (err error) {
	err = db.Model(&model.ArticleTag{}).Where("id = ?", id).Updates(columns).Error
	return
}

func (this *articleTagRepository) UpdateColumn(db *gorm.DB, id int64, name string, value interface{}) (err error) {
	err = db.Model(&model.ArticleTag{}).Where("id = ?", id).UpdateColumn(name, value).Error
	return
}

func (this *articleTagRepository) Delete(db *gorm.DB, id int64) {
	db.Delete(&model.ArticleTag{}, "id = ?", id)
}

func (this *articleTagRepository) AddArticleTags(db *gorm.DB, articleId int64, tagIds []int64) {
	if articleId <= 0 || len(tagIds) == 0 {
		return
	}

	for _, tagId := range tagIds {
		_ = this.Create(db, &model.ArticleTag{
			ArticleId:  articleId,
			TagId:      tagId,
			CreateTime: simple.NowTimestamp(),
		})
	}
}

func (this *articleTagRepository) RemoveArticleTags(db *gorm.DB, articleId int64) {
	if articleId <= 0 {
		return
	}

	db.Where("article_id = ?", articleId).Delete(model.ArticleTag{})
}

func (this *articleTagRepository) GetUnique(db *gorm.DB, articleId, tagId int64) *model.ArticleTag {
	ret := &model.ArticleTag{}
	if err := db.First(ret, "article_id = ? and tag_id = ?", articleId, tagId).Error; err != nil {
		return nil
	}
	return ret
}

func (this *articleTagRepository) GetByArticleId(db *gorm.DB, articleId int64) ([]model.ArticleTag, error) {
	return this.QueryCnd(db, simple.NewQueryCnd("article_id = ?", articleId))
}
