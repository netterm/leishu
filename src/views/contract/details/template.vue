<template>
  <div class="template-wrapper">
    <div class="line flex">
      <div>编号</div>
      <div class="input" style="min-width: 3rem">
        <span>{{ contractCode }}</span>
      </div>
    </div>
    <h2 class="text-center">劳动合同</h2>
    <div class="content">
      <div class="line">
        <span>甲方（用人单位）名称：</span>
        <div class="input">
          <span>{{ corpName }}</span>
        </div>
      </div>
      <div class="line flex">
        <span>法定代表人：</span>
        <div class="input flex-auto w-0">
          <span>{{ legalPerson }}</span>
        </div>
      </div>
      <div class="line flex">
        <span>委托代理人：</span>
        <div class="input flex-auto w-0"><span></span></div>
        <span>联系电话：</span>
        <div class="input flex-auto w-0">
          <span>{{ phone }}</span>
        </div>
      </div>
      <div class="line flex">
        <span>单位地址：</span>
        <div class="input flex-auto w-0">
          <span>{{ address }}</span>
        </div>
      </div>
      <div class="line flex">
        <span>乙方（劳动者）姓名：</span>
        <div class="input flex-auto w-0">
          <span>{{ name }}</span>
        </div>
        <span>性别：</span>
        <div class="input flex-auto w-0">
          <span>{{ sex ? '男' : '女' }}</span>
        </div>
      </div>
      <div class="line flex">
        <div>家庭住址：</div>
        <div class="input flex-auto w-0">
          <span>{{ personAdd }}</span>
        </div>
      </div>
      <div class="line flex">
        <div>居民身份证号码：</div>
        <div class="input flex-auto w-0">
          <span>{{ account.idCard }}</span>
        </div>
      </div>
      <div class="line flex">
        <div>联系电话：</div>
        <div class="input flex-auto w-0">
          <span>{{ mobile }}</span>
        </div>
      </div>
      <div class="line flex">
        <div>工资银行卡号码：</div>
        <div class="input flex-auto w-0">
          <span>{{ bankCard }}</span>
        </div>
      </div>
      <div class="line">
        <i class="text-gray-7">
          甲乙双方根据《劳动法》、《劳动合同法》等法律、法规规定，遵循合法、公平、平等自愿、协商一致、诚实信用的原则，签订本合同，共同遵守。
        </i>
      </div>
      <h3>一、劳动合同期限</h3>
      <div class="line">
        <b>第一条</b>
        甲、乙双方自愿约定按下列第
        <div class="input" style="min-width: 1rem">
          <span>{{ contractPeriodType || 0 + 1 }}</span>
        </div>
        种形式确定本合同期限：
      </div>
      <div class="line">
        1.从
        <div class="input" style="min-width: 1rem">
          <span>{{ startDate && startDate.replace(/^(\d{4}).*$/, '$1') }}</span>
        </div>
        年
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            startDate && startDate.replace(/^\d{4}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        月
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            startDate && startDate.replace(/^\d{4}-\d{2}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        日起至
        <div class="input" style="min-width: 1rem">
          <span>{{ endDate && endDate.replace(/^(\d{4}).*$/, '$1') }}</span>
        </div>
        年
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            endDate && endDate.replace(/^\d{4}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        月
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            endDate && endDate.replace(/^\d{4}-\d{2}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        日止。
      </div>
      <div class="line">
        2.从
        <div class="input" style="min-width: 1rem">
          <span>{{ startDate && startDate.replace(/^(\d{4}).*$/, '$1') }}</span>
        </div>
        年
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            startDate && startDate.replace(/^\d{4}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        月
        <div class="input" style="min-width: 0.6rem">
          <span>{{
            startDate && startDate.replace(/^\d{4}-\d{2}-(\d{2}).*$/, '$1')
          }}</span>
        </div>
        日起至
        <div class="input" style="min-width: 3rem">
          <span>{{ unKnowHour }}</span>
        </div>
        工作任务完成时止。
      </div>
      <h3>二、工作地点和工作内容</h3>
      <div class="line">
        <b>第二条</b>
        乙方同意在甲方
        <div class="input" style="min-width: 1rem">
          <span>{{ project.areaName }}</span>
        </div>
        <div class="input" style="min-width: 4rem">
          <span>{{ project.name }}</span>
        </div>
        （项目或工地），从事
        <div class="input" style="min-width: 2rem">
          <span>{{ workDuty }}</span>
        </div>
        岗位（工种）工作。
      </div>
      <div class="line">
        <i class="text-gray-7">
          乙方按照甲方的要求及规定的标准，按时保质保量完成工作任务。经双方协商同意，甲方可以变更乙方工作岗位（工种）和工作地点
        </i>
      </div>
      <h3>三、劳动报酬</h3>
      <div class="line">
        <b>第三条</b>
        甲、乙双方自愿约定按下列第
        <div class="input" style="min-width: 1rem">
          <span>{{ { 1: 1, 2: 3, 3: 4 }[payType] }}</span>
        </div>
        种结算方式计算乙方工资，并按时足额支付：
      </div>
      <div class="line">
        1.每月工资为
        <div class="input" style="min-width: 1rem">
          <span>{{ monthSalary }}</span>
        </div>
        元，于当（次）月
        <div class="input" style="min-width: 0.6rem">
          <span>{{ payDay }}</span>
        </div>
        日前向乙方支付。
      </div>
      <div class="line">
        2.每日工资为
        <div class="input" style="min-width: 1rem" />
        元或每小时工资为
        <div class="input" style="min-width: 0.6rem" />
        元，以实际考勤数当日进行核算支付；每周工资为
        <div class="input" style="min-width: 1rem" />
        元，以实际考勤数每周进行核算支付。
      </div>
      <div class="line">
        3.按
        <div class="input" style="min-width: 1rem">
          <span>{{ workloadMoney }}</span>
        </div>
        元/工作计量单位核算工资，每月应进行核算，于当（次）月
        <div class="input" style="min-width: 0.6rem">
          <span>{{ payDay }}</span>
        </div>
        日前向乙方支付；因不可抗力未能在支付日期支付工资的，应当在不可抗力消除后
        <div class="input" style="min-width: 0.6rem" />
        日内支付给乙方。
      </div>
      <div class="line">
        4.其他形式的工资
        <div class="input" style="min-width: 3rem">
          <span>{{ otherSalary }}</span>
        </div>
        。
      </div>
      <div class="line">
        <i class="text-gray-7">
          甲方原则上通过银行转账形式支付乙方工资。甲方向乙方支付工资时，应当向乙方提供本人的工资清单，由乙方本人签字（按印）确认领取。不足一个月的临时性用工或零星用工等特殊情况下，也可以现金支付。
        </i>
      </div>
      <h3>四、工作时间</h3>
      <div class="line">
        <b>第四条</b>
        甲方统筹安排乙方工作时间，并按照国家和省有关规定合理安排乙方休息时间，保障乙方休息休假权。
      </div>
      <h3>五、实名制管理</h3>
      <div class="line">
        <b>第五条</b>
        乙方应服从用人单位的实名制管理，进场作业前须接受基本安全培训，接受项目劳资专管员管理，按实名制管理要求考勤。
      </div>
      <h3>六、劳动保护</h3>
      <div class="line">
        <b>第六条</b>
        甲方应依法保障乙方职业安全和卫生权益，配备安全生产和职业病防护设施，并向乙方告知劳动安全、职业危害事项，发放符合要求的劳动保护用品。
      </div>
      <div class="line">
        <i class="text-gray-7"
          >乙方有权对甲方及其管理人员漠视乙方安全和健康的行为提出批评、检举、控告；有权拒绝违章指挥和强令冒险作业。</i
        >
      </div>
      <h3>七、劳动争议处理</h3>
      <div class="line">
        <b>第七条</b>
        双方因履行本合同发生劳动争议，可以协商解决；不愿协商或协商不成，可以向劳动争议调解组织申请调解；不愿调解或调解不成，可以向有管辖权的劳动人事争议仲裁委员会申请仲裁。对仲裁裁决不服的，可以向人民法院提起诉讼。
      </div>
      <h3>八、其他</h3>
      <div class="line">
        <b>第八条</b>
        甲乙双方约定的专项协议、劳动合同变更协议及甲方规章制度均作为本合同的附件，与本合同具有同等效力。
      </div>
      <div class="line">
        <b>第九条</b> 本合同未尽事宜，按国家和我省有关法律、法规、规章执行。
      </div>
      <div class="line">
        <b>第十条</b>
        本合同自签订盖章（按印）之日起生效，甲乙双方各执一份，具有同等法
      </div>
      <div class="line flex">
        <b>第十一条</b> 其他补充事项
        <div class="input flex-auto w-0">
          <span>{{ remark }}</span>
        </div>
      </div>

      <div class="line flex" style="margin-top: 3rem">
        甲方：（盖章）
        <div class="flex-auto w-0" />
        乙方：（签名、按印）
        <div v-if="!signId" class="flex-auto w-0" />
      </div>
      <div class="line flex">
        <div class="flex-auto w-0" />
        <div class="flex-auto w-0 text-center">
          <van-image
            v-if="signId"
            :src="getImageUrlById(signId)"
            width="3rem"
            height="2rem"
            fit="contain"
          />
        </div>
      </div>
      <div class="line flex">
        法定代表人（签名）：
        <div class="flex-auto w-0" />
      </div>
      <div class="line flex">
        委托代理人（签名）：
        <div class="flex-auto w-0" />
      </div>
      <div class="line flex">
        <div class="input" style="min-width: 1rem" />
        年
        <div class="input" style="min-width: 0.6rem" />
        月
        <div class="input" style="min-width: 0.6rem" />
        日
        <div class="flex-auto w-0" />
        <div class="input" style="min-width: 1rem" />
        年
        <div class="input" style="min-width: 0.6rem" />
        月
        <div class="input" style="min-width: 0.6rem" />
        日
      </div>
    </div>

    <div class="flex justify-between flex-wrap text-center" style="margin-top: 3rem">
      <div class="flex justify-center items-center picture">此处粘贴劳动者身份证复印件正面</div>
      <div class="flex justify-center items-center picture">此处粘贴劳动者身份证复印件反面</div>
      <div class="flex justify-center items-center picture">
        此处粘贴劳动者工资银行卡复印件正面
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/index'
import { getImageUrlById } from '@/utils/getFileUrl'
import props from './props'
const auth = useAuthStore()
export default {
  name: 'ContractTemplate',
  props,
  data() {
    return {
      account: auth.account,
      project: auth.project
    }
  },
  methods: { getImageUrlById }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme';
.template-wrapper {
  padding: 0 0.38rem;
  color: $black;
  h2 {
    margin: 0.6rem 0 0.8rem;
  }
  .line {
    margin: 0.4rem 0;
    line-height: 1.6;
  }
  .input {
    display: inline;
    line-height: 1.6;
    border-bottom: 1px solid $gray;
    font-family: '楷体', '楷体_GB2312';
    font-weight: 500;
    & > span {
      padding: 0 0.4rem;
    }
  }
  .content {
    padding: 0 0.2rem;
  }
  .picture {
    margin-bottom: 0.4rem;
    width: 46%;
    height: 3rem;
    border: 1px solid $black;
  }
  b {
    margin-right: 0.4rem;
  }
}
</style>
