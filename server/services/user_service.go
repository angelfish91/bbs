package services

import (
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/kataras/iris/core/errors"
	"github.com/mlogclub/simple"

	"github.com/mlogclub/bbs-go/common"
	"github.com/mlogclub/bbs-go/common/validate"
	"github.com/mlogclub/bbs-go/services/cache"

	"github.com/mlogclub/bbs-go/model"
	"github.com/mlogclub/bbs-go/repositories"
)

var UserService = newUserService()

func newUserService() *userService {
	return &userService{}
}

type userService struct {
}

func (this *userService) Get(id int64) *model.User {
	return repositories.UserRepository.Get(simple.GetDB(), id)
}

func (this *userService) Take(where ...interface{}) *model.User {
	return repositories.UserRepository.Take(simple.GetDB(), where...)
}

func (this *userService) QueryCnd(cnd *simple.QueryCnd) (list []model.User, err error) {
	return repositories.UserRepository.QueryCnd(simple.GetDB(), cnd)
}

func (this *userService) Query(queries *simple.ParamQueries) (list []model.User, paging *simple.Paging) {
	return repositories.UserRepository.Query(simple.GetDB(), queries)
}

func (this *userService) Create(t *model.User) error {
	err := repositories.UserRepository.Create(simple.GetDB(), t);
	if err == nil {
		cache.UserCache.Invalidate(t.Id)
	}
	return nil
}

func (this *userService) Update(t *model.User) error {
	err := repositories.UserRepository.Update(simple.GetDB(), t)
	cache.UserCache.Invalidate(t.Id)
	return err
}

func (this *userService) Updates(id int64, columns map[string]interface{}) error {
	err := repositories.UserRepository.Updates(simple.GetDB(), id, columns)
	cache.UserCache.Invalidate(id)
	return err
}

func (this *userService) UpdateColumn(id int64, name string, value interface{}) error {
	err := repositories.UserRepository.UpdateColumn(simple.GetDB(), id, name, value)
	cache.UserCache.Invalidate(id)
	return err
}

func (this *userService) Delete(id int64) {
	repositories.UserRepository.Delete(simple.GetDB(), id)
	cache.UserCache.Invalidate(id)
}

func (this *userService) GetByEmail(email string) *model.User {
	return repositories.UserRepository.GetByEmail(simple.GetDB(), email)
}

func (this *userService) GetByUsername(username string) *model.User {
	return repositories.UserRepository.GetByUsername(simple.GetDB(), username)
}

// 登录
func (this *userService) SignIn(username, password string) (*model.User, error) {
	if len(username) == 0 {
		return nil, errors.New("用户名/邮箱不能为空")
	}
	if len(password) == 0 {
		return nil, errors.New("密码不能为空")
	}
	var user *model.User = nil
	if validate.IsEmail(username) { // 如果用户输入的是邮箱
		user = this.GetByEmail(username)
	} else {
		user = this.GetByUsername(username)
	}
	if user == nil {
		return nil, errors.New("用户不存在")
	}
	if !simple.ValidatePassword(user.Password, password) {
		return nil, errors.New("密码错误")
	}
	return user, nil
}

// 注册
func (this *userService) SignUp(username, email, password, rePassword, nickname, avatar string) (*model.User, error) {
	username = strings.TrimSpace(username)
	email = strings.TrimSpace(email)

	if !common.IsValidateUsername(username) {
		return nil, errors.New("用户名必须由5-12位(数字、字母、_、-)组成，且必须以字母开头。")
	}
	if !validate.IsEmail(email) {
		return nil, errors.New("请输入合法的邮箱")
	}
	if len(password) == 0 {
		return nil, errors.New("请输入密码")
	}
	if simple.RuneLen(password) < 6 {
		return nil, errors.New("密码过于简单")
	}
	if len(nickname) == 0 {
		return nil, errors.New("昵称不能为空")
	}
	if password != rePassword {
		return nil, errors.New("两次输入密码不匹配")
	}

	if this.GetByUsername(username) != nil {
		return nil, errors.New("用户名：" + username + " 已被占用")
	}

	if this.GetByEmail(email) != nil {
		return nil, errors.New("邮箱：" + email + " 已被占用")
	}

	password = simple.EncodePassword(password)

	user := &model.User{
		Username:   username,
		Email:      email,
		Nickname:   nickname,
		Password:   password,
		Avatar:     avatar,
		Status:     model.UserStatusOk,
		CreateTime: simple.NowTimestamp(),
		UpdateTime: simple.NowTimestamp(),
	}

	err := this.Create(user)
	if err != nil {
		return nil, err
	}

	cache.UserCache.Invalidate(user.Id)
	return user, nil
}

// Github账号登录
func (this *userService) SignInByThirdAccount(thirdAccount *model.ThirdAccount) (*model.User, *simple.CodeError) {
	user := this.Get(thirdAccount.UserId)
	if user != nil {
		return user, nil
	}

	user = &model.User{
		Nickname:   thirdAccount.Nickname,
		Avatar:     thirdAccount.Avatar,
		Status:     model.UserStatusOk,
		CreateTime: simple.NowTimestamp(),
		UpdateTime: simple.NowTimestamp(),
	}
	err := simple.Tx(simple.GetDB(), func(tx *gorm.DB) error {
		err := repositories.UserRepository.Create(tx, user)
		if err != nil {
			return err
		}
		err = repositories.ThirdAccountRepository.UpdateColumn(tx, thirdAccount.Id, "user_id", user.Id)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, simple.FromError(err)
	}
	cache.UserCache.Invalidate(user.Id)
	return user, nil
}

// 邮箱是否存在
func (this *userService) isEmailExists(email string) bool {
	if len(email) == 0 { // 如果邮箱为空，那么就认为是不存在
		return false
	}
	return this.GetByEmail(email) != nil
}

// 用户名是否存在
func (this *userService) isUsernameExists(username string) bool {
	return this.GetByUsername(username) != nil
}
