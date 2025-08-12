import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "개인정보처리방침",
    "description": "동진테크의 개인정보처리방침입니다.",
    "url": "https://www.remen-abs.com/privacy"
  };

  return (
    <div>
      <SEO
        title="개인정보처리방침 | REMEN_ABS"
        description="동진테크는 고객의 개인정보를 보호하고 있습니다. 개인정보 수집, 이용, 제공에 관한 상세한 내용을 확인하세요."
        keywords="개인정보처리방침, 개인정보 보호, 동진테크 개인정보, ABS 수리 개인정보"
        canonical="https://www.remen-abs.com/privacy"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            개인정보처리방침
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-green-100 max-w-3xl mx-auto"
          >
            동진테크는 고객의 개인정보를 보호하고 있습니다.
          </motion.p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-600 mb-6">
              동진테크(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 
              다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-600">
                <li>• 회원가입 및 관리: 회원제 서비스 제공, 회원자격 유지·관리, 서비스 부정이용 방지</li>
                <li>• 재화 또는 서비스 제공: 물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공</li>
                <li>• 고충처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
                <li>• 마케팅 및 광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. 개인정보의 처리 및 보유기간</h2>
            <p className="text-gray-600 mb-6">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">개인정보 보유기간</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 회원가입정보: 회원탈퇴 시까지 (단, 관계법령에 따라 보존이 필요한 경우 해당 기간)</li>
                <li>• 거래정보: 거래 완료 후 5년 (전자상거래법)</li>
                <li>• 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                <li>• 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                <li>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                <li>• 표시·광고에 관한 기록: 6개월 (전자상거래법)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. 개인정보의 제3자 제공</h2>
            <p className="text-gray-600 mb-6">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
              정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">제3자 제공 현황</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 제공받는 자: 배송업체 (CJ대한통운, 로젠택배 등)</li>
                <li>• 제공하는 항목: 수령인명, 연락처, 배송주소</li>
                <li>• 제공 목적: 상품 배송</li>
                <li>• 보유 및 이용기간: 배송 완료 후 1년</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. 개인정보처리의 위탁</h2>
            <p className="text-gray-600 mb-6">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">위탁업체 현황</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 위탁받는 자: 결제대행사 (이니시스, KG이니시스 등)</li>
                <li>• 위탁하는 업무: 결제처리</li>
                <li>• 위탁기간: 계약 종료 시까지</li>
                <li>• 위탁받는 자: 고객상담업체</li>
                <li>• 위탁하는 업무: 고객상담</li>
                <li>• 위탁기간: 계약 종료 시까지</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. 정보주체의 권리·의무 및 그 행사방법</h2>
            <p className="text-gray-600 mb-6">
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-600">
                <li>• 개인정보 열람요구</li>
                <li>• 오류 등이 있을 경우 정정 요구</li>
                <li>• 삭제요구</li>
                <li>• 처리정지 요구</li>
              </ul>
            </div>
            <p className="text-gray-600 mb-6">
              제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 
              회사는 이에 대해 지체없이 조치하겠습니다.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. 처리하는 개인정보의 항목</h2>
            <p className="text-gray-600 mb-6">
              회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">수집하는 개인정보 항목</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 필수항목: 이메일주소, 비밀번호, 로그인ID, 이름, 생년월일, 성별, 연락처, 주소</li>
                <li>• 선택항목: 결혼여부, 관심분야, 직업, 회사명, 부서, 직책</li>
                <li>• 자동수집항목: IP주소, 쿠키, MAC주소, 서비스 이용기록, 접속 로그, 방문 일시, 서비스 이용기록, 불량 이용기록</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. 개인정보의 파기</h2>
            <p className="text-gray-600 mb-6">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체없이 해당 개인정보를 파기합니다. 파기절차 및 방법은 다음과 같습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">파기절차 및 방법</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                <li>• 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                <li>• 개인정보의 보유기간이 경과한 경우: 보유기간의 종료일로부터 5일 이내에 개인정보를 파기합니다.</li>
                <li>• 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. 개인정보의 안전성 확보 조치</h2>
            <p className="text-gray-600 mb-6">
              회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-600">
                <li>• 개인정보의 암호화: 이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하여 사용합니다.</li>
                <li>• 해킹 등에 대비한 기술적 대책: 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</li>
                <li>• 개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</li>
                <li>• 접속기록의 보관 및 위변조 방지: 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.</li>
                <li>• 개인정보의 암호화: 이용자의 개인정보는 비밀번호에 의해 보호되며, 파일 및 전송 데이터를 암호화하여 중요한 데이터는 별도의 보안기능을 통해 보호되고 있습니다.</li>
                <li>• 비인가자에 대한 출입 통제: 개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. 개인정보 보호책임자</h2>
            <p className="text-gray-600 mb-6">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">개인정보 보호책임자</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 성명: 오미숙</li>
                <li>• 직책: 대표이사</li>
                <li>• 연락처: 032-221-9182</li>
                <li>• 이메일: info@remen-abs.com</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. 개인정보 처리방침의 변경</h2>
            <p className="text-gray-600 mb-6">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. 개인정보의 열람청구를 접수·처리하는 부서</h2>
            <p className="text-gray-600 mb-6">
              정보주체는 개인정보보호법 제35조에 따른 개인정보의 열람청구를 아래의 부서에 할 수 있습니다. 
              회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-600">
                <li>• 개인정보 열람청구 접수·처리 부서</li>
                <li>• 부서명: 개인정보보호팀</li>
                <li>• 담당자: 오미숙</li>
                <li>• 연락처: 032-221-9182</li>
                <li>• 이메일: info@remen-abs.com</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">12. 정보주체의 권익침해에 대한 구제방법</h2>
            <p className="text-gray-600 mb-6">
              아래의 기관에 대해 개인정보 분쟁조정위원회, 개인정보보호위원회, 정보보호마크인증위원회, 
              개인정보보호지원센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 
              이 기관들은 회사와는 별개의 기관으로서, 회사의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 
              보다 자세한 도움이 필요하시면 문의하시기 바랍니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-600">
                <li>• 개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.privacy.go.kr)</li>
                <li>• 개인정보보호위원회: (국번없이) 1833-6972 (www.privacy.go.kr)</li>
                <li>• 정보보호마크인증위원회: 02-580-0533~4 (www.eprivacy.or.kr)</li>
                <li>• 개인정보보호지원센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-green-800">
                <strong>시행일자:</strong> 2024년 1월 1일<br/>
                <strong>최종 수정일:</strong> 2024년 12월 1일
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy; 