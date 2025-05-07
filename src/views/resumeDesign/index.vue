<template>
  <div>
    <div class="header">在线简历编辑器与评估工具</div>

    <div class="container">
      <div class="editor-container">
        <div class="function-bar">
          <div class="template-dropdown">
            <div style="display: flex; align-items: center;">
              <select class="template-select" v-model="selectedTemplate" @change="applyTemplate">
                <option value="simple">简约模板</option>
                <option value="modern">现代模板</option>
                <option value="professional">专业模板</option>
                <option value="creative">创意模板</option>
              </select>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn" @click="checkResume">检查简历</button>
            <button class="btn" @click="evaluateResume">评估简历</button>
            <button class="btn" @click="exportResume">导出简历</button>
          </div>
        </div>

        <div class="editor-wrapper">
          <div class="editor-section">
            <div class="section-header">简历编辑器</div>
            <textarea class="editor-textarea" v-model="resumeContent" @input="updatePreview"></textarea>
          </div>

          <div class="preview-section">
            <div class="section-header">实时预览</div>
            <div class="preview-content" v-html="previewContent"></div>
          </div>
        </div>
      </div>

      <div class="result-container" v-if="evaluationResult">
        <div class="result-header">检查/评估结果</div>

        <div class="score-display" v-if="evaluationResult.score">
          简历评分：{{ evaluationResult.score }} / 100
        </div>

        <div class="suggestions">
          <h3 v-if="evaluationResult.missingInfo">缺失的关键信息：</h3>
          <div class="suggestion-item" v-for="item in evaluationResult.missingInfo" :key="item">{{ item }}</div>

          <h3 v-if="evaluationResult.suggestions">改进建议：</h3>
          <div class="suggestion-item" v-for="suggestion in evaluationResult.suggestions" :key="'suggestion-' + suggestion">{{ suggestion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeBuilder',
  data() {
    return {
      selectedTemplate: 'simple',
      resumeContent: '姓名：张三\n联系方式：13800138000 / zhangsan@example.com\n\n【个人简介】\n\n【教育背景】\n\n【工作经历】\n\n【技能专长】\n\n【自我评价】',
      previewContent: '',
      evaluationResult: null,
      templates: {
        simple: {
          name: '简约模板',
          content: '姓名：\n联系方式：\n\n【个人简介】\n\n【教育背景】\n\n【工作经历】\n\n【技能专长】\n\n【自我评价】'
        },
        modern: {
          name: '现代模板',
          content: '【个人信息】\n姓名：\n电话：\n邮箱：\n\n【教育背景】\n\n【工作经历】\n\n【技能专长】\n\n【自我评价】'
        },
        professional: {
          name: '专业模板',
          content: '【个人简介】\n\n【教育背景】\n（从最近的学历开始倒序填写）\n\n【工作经历】\n（从最近的工作开始倒序填写）\n\n【项目经验】\n\n【技能专长】\n\n【自我评价】'
        },
        creative: {
          name: '创意模板',
          content: '🌟 个人名片 🌟\n\n名：\n\n💡 我的亮点：\n\n🎓 教育背景：\n\n🏢 工作经历：\n\n🔧 技能专长：\n\n📈 成就与荣誉：'
        }
      }
    };
  },
  mounted() {
    this.updatePreview();
  },
  methods: {
    updatePreview() {
      this.previewContent = this.resumeContent.replace(/\n/g, '<br>');
    },
    checkResume() {
      const keywords = {
        '姓名': /姓名|name|称|姓名/i,
        '联系方式': /联系方式|电话|邮箱|手机|联系电话|电子邮箱/i,
        '教育背景': /教育背景|学历|学校|毕业院校/i,
        '工作经历': /工作经历|经验|职位|工作|任职|实习/i
      };

      const missingInfo = [];

      for (const [key, regex] of Object.entries(keywords)) {
        if (!regex.test(this.resumeContent)) {
          missingInfo.push(key);
        }
      }

      this.evaluationResult = {
        missingInfo,
        score: Math.max(0, 100 - missingInfo.length * 25)
      };

      if (missingInfo.length === 0) {
        this.evaluationResult.suggestions = ['您的简历内容较为完善。'];
      }
    },
    evaluateResume() {
      const keywords = [
        { name: '教育', regex: /教育|学历|学校|毕业院校/i },
        { name: '工作经历', regex: /工作|经验|职位|任职|实习/i },
        { name: '技能', regex: /技能|专长|能力|熟练掌握/i },
        { name: '自我评价', regex: /自我评价|个人简介|个人陈述|自我简介/i },
        { name: '项目经验', regex: /项目|课题|研究|案例/i },
        { name: '证书', regex: /证书|认证|资格|获奖|荣誉/i },
        { name: '语言能力', regex: /语言|英语|日语|法语|德语|西班牙语|俄语/i }
      ];

      const contentLength = this.resumeContent.length;
      const keywordResults = keywords.map(keyword => ({
        name: keyword.name,
        found: keyword.regex.test(this.resumeContent)
      }));

      const includedKeywords = keywordResults.filter(result => result.found).length;
      let score = Math.min(100, Math.floor((includedKeywords / keywords.length) * 70 + (contentLength / 1000) * 30));

      if (contentLength === 0) {
        score = 0;
        this.evaluationResult = {
          score,
          suggestions: ['简历内容为空，请添加您的个人信息和经历。']
        };
        return;
      }

      const suggestions = [];
      const missingKeywords = keywordResults.filter(result => !result.found).map(result => result.name);

      if (missingKeywords.length > 0) {
        suggestions.push(`建议添加以下信息：${missingKeywords.join('、')}`);
      }

      if (contentLength < 300) {
        suggestions.push('简历内容较短，建议增加详细描述和具体实例。');
      } else if (contentLength < 500) {
        suggestions.push('简历内容可以进一步丰富，建议添加更多细节和成就描述。');
      }

      if (!/电话|手机/i.test(this.resumeContent)) {
        suggestions.push('建议添加联系方式，包括电话和邮箱。');
      }

      if (!/\d+\s*(人|万|亿|元|美元|欧元|日元|次|项|个|台|小时|分钟|秒|公里|米|厘米|毫米|升|毫升|吨|千克|克|兆|吉|千|百)/i.test(this.resumeContent)) {
        suggestions.push('建议在工作经历或项目经验中加入量化成果，如"提高了30%的效率"或"管理了5人的团队"。');
      }

      if (suggestions.length === 0) {
        suggestions.push('您的简历内容较为完善，已包含所有关键信息。');
      }

      this.evaluationResult = {
        score,
        suggestions,
        missingInfo: missingKeywords
      };
    },
    applyTemplate(templateName) {
      if (templateName) {
        this.selectedTemplate = templateName;
      }
      this.resumeContent = this.templates[this.selectedTemplate].content;
      this.updatePreview();
    },
    exportResume() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('个人简历', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const lines = this.resumeContent.split('\n');
      let startY = 30;
      const lineHeight = 6;
      lines.forEach((line, index) => {
        doc.text(line, 20, startY + index * lineHeight);
      });
      const fileName = '简历_' + (new Date().toLocaleDateString().replace(/\//g, '-')) + '.pdf';
      doc.save(fileName);
      alert('简历已成功导出为PDF格式。DOCX导出功能需要额外的后端支持。');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}
body {
  background-color: #f5f5f5;
  color: #333;
}
.header {
  background-color: #1e88e5;
  color: white;
  text-align: center;
  padding: 20px 0;
  font-size: 24px;
  font-weight: bold;
}
.container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.editor-container {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 20px;
}
.function-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}
.template-select {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  outline: none;
  background-color: white;
  font-size: 14px;
}
.btn-group {
  display: flex;
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #1e88e5;
  color: white;
  cursor: pointer;
  margin: 0 5px;
  outline: none;
  font-size: 14px;
  transition: background-color 0.3s;
}
.btn:hover {
  background-color: #1565c0;
}
.editor-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.editor-section,
.preview-section {
  width: 48%;
}
.section-header {
  color: #555;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 12px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: normal;
  font-size: 16px;
}
.editor-textarea {
  width: 100%;
  height: 350px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
}
.preview-content {
  height: 350px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  background-color: #fafafa;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}
.result-container {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
}
.result-header {
  color: #555;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: normal;
  font-size: 16px;
}
.score-display {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
}
.suggestions {
  margin-top: 20px;
  line-height: 1.8;
  color: #666;
}
.suggestion-item {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}
.suggestion-item:before {
  content: "•";
  margin-right: 8px;
  color: #1e88e5;
}
.template-dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 4px;
  margin-top: 5px;
  left: 0;
}
.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.template-dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 768px) {
  .editor-wrapper {
    flex-direction: column;
  }
  .editor-section,
  .preview-section {
    width: 100%;
    margin-bottom: 20px;
  }
  .function-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .template-select {
    margin-bottom: 10px;
    margin-right: 0;
  }
  .btn-group {
    flex-direction: column;
  }
  .btn {
    margin: 5px 0;
    width: 100%;
  }
}
</style>
