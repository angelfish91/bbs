
package repositories

import (
	"github.com/mlogclub/bbs-go/model"
	"github.com/mlogclub/simple"
	"github.com/jinzhu/gorm"
)

var LinkRepository = newLinkRepository()

func newLinkRepository() *linkRepository {
	return &linkRepository{}
}

type linkRepository struct {
}

func (this *linkRepository) Get(db *gorm.DB, id int64) *model.Link {
	ret := &model.Link{}
	if err := db.First(ret, "id = ?", id).Error; err != nil {
		return nil
	}
	return ret
}

func (this *linkRepository) Take(db *gorm.DB, where ...interface{}) *model.Link {
	ret := &model.Link{}
	if err := db.Take(ret, where...).Error; err != nil {
		return nil
	}
	return ret
}

func (this *linkRepository) QueryCnd(db *gorm.DB, cnd *simple.QueryCnd) (list []model.Link, err error) {
	err = cnd.DoQuery(db).Find(&list).Error
	return
}

func (this *linkRepository) Query(db *gorm.DB, queries *simple.ParamQueries) (list []model.Link, paging *simple.Paging) {
	queries.StartQuery(db).Find(&list)
    queries.StartCount(db).Model(&model.Link{}).Count(&queries.Paging.Total)
	paging = queries.Paging
	return
}

func (this *linkRepository) Create(db *gorm.DB, t *model.Link) (err error) {
	err = db.Create(t).Error
	return
}

func (this *linkRepository) Update(db *gorm.DB, t *model.Link) (err error) {
	err = db.Save(t).Error
	return
}

func (this *linkRepository) Updates(db *gorm.DB, id int64, columns map[string]interface{}) (err error) {
	err = db.Model(&model.Link{}).Where("id = ?", id).Updates(columns).Error
	return
}

func (this *linkRepository) UpdateColumn(db *gorm.DB, id int64, name string, value interface{}) (err error) {
	err = db.Model(&model.Link{}).Where("id = ?", id).UpdateColumn(name, value).Error
	return
}

func (this *linkRepository) Delete(db *gorm.DB, id int64) {
	db.Delete(&model.Link{}, "id = ?", id)
}

