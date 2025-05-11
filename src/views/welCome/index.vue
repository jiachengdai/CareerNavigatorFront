<template>
  <div
    style="
      width: 100%;
      height: 100vh;
      position: relative;
      background-color: rgba(224, 247, 254, 0.8);
    "
  >
    <img
      src="/src/assets/imgs/image.png"
      alt=""
      style="
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      "
    />
    <div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
        "
      >
        <div style="display: flex; align-items: center">
          <img
            src="/public/favicon.ico"
            alt="Logo"
            style="height: 40px; margin-right: 10px"
          />
          <span
            style="font-size: 32px; font-weight: thin; font-family: 'Comic Sans MS'"
            class="logo"
          >
            CareerNavigator
          </span>
        </div>
        <div>
          <button
            style="
              margin-right: 15px;
              background: none;
              border: none;
              font-size: 20px;
              cursor: pointer;
              color: #0056b3;
              transition: transform 0.2s;
            "
            @mouseover="hoverEffect($event)"
            @mouseleave="resetEffect($event)"
          >
            📧 联系我们
          </button>
          <button
            style="
              font-size: 20px;
              padding: 5px 15px;
              background-color: #0056b3;
              border: none;
              color: white;
              border-radius: 5px;
              cursor: pointer;
              transition: transform 0.2s, background-color 0.3s;
            "
            @mouseover="hoverEffect($event)"
            @mouseleave="resetEffect($event)"
            @click="$router.push('/login')"
          >
            🚀 立即注册
          </button>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20vh; color: #0056b3">
        <h1 style="font-size: 56px; font-weight: bold; margin: 0">CareerNavigator 🌍</h1>
        <p style="font-size: 28px; margin: 10px 0; color: #333">
          让您的求职旅途不再迷茫 ✨
        </p>
        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 60px">
          <div style="text-align: center; width: 250px">
            <h3 style="font-size: 24px; color: #0056b3; margin: 10px 0">✍️ 简历助手</h3>
            <p style="font-size: 18px; color: #333">
              提供在线简历编辑与AI智能润色功能，让简历更具竞争力。
            </p>
          </div>
          <div style="text-align: center; width: 250px">
            <h3 style="font-size: 24px; color: #0056b3; margin: 10px 0">🤖 AI模拟面试</h3>
            <p style="font-size: 18px; color: #333">
              通过AI技术模拟真实面试场景，提升您的面试表现。
            </p>
          </div>
          <div style="text-align: center; width: 250px">
            <h3 style="font-size: 24px; color: #0056b3; margin: 10px 0">
              📤 岗位投递集成
            </h3>
            <p style="font-size: 18px; color: #333">
              每一次投递都值得被记录，在记录中反思，冲击更高目标
            </p>
          </div>
        </div>
        <div style="margin-top: 50px">
          <button
            style="
              font-size: 20px;
              padding: 10px 30px;
              background-color: #0056b3;
              border: none;
              color: white;
              border-radius: 5px;
              cursor: pointer;
              margin-right: 20px;
              transition: transform 0.2s, background-color 0.3s;
            "
            @mouseover="hoverEffect($event)"
            @mouseleave="resetEffect($event)"
            @click="$router.push('/login')"
          >
            🚀 立即体验
          </button>
          <button
            style="
              font-size: 20px;
              padding: 10px 30px;
              background-color: white;
              border: 2px solid #0056b3;
              color: #0056b3;
              border-radius: 5px;
              cursor: pointer;
              transition: transform 0.2s, background-color 0.3s;
            "
            @mouseover="hoverEffect($event)"
            @mouseleave="resetEffect($event)"
            @click="scrollToSection"
          >
            ❓ 使用帮助
          </button>
        </div>
      </div>
    </div>
  </div>

  <div style="background-color: rgba(224, 247, 254, 0.8)">
    <div
      id="help-section"
      style="
        text-align: center;
        font-size: 36px;
        color: #0056b3;
        margin: 40px 0;
        font-weight: bold;
      "
    >
      <span style="font-family: 'Comic Sans MS'; font-weight: bolder"
        >What Can We Provide You?</span
      >
      🌟
    </div>
    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px;
        gap: 20px;
      "
    >
      <div style="width: 50%; text-align: left; animation: fadeInLeft 1s ease-in-out">
        <h2
          style="font-size: 36px; color: #0056b3; margin-bottom: 20px; font-weight: bold"
        >
          ✍️ 在线简历编辑与AI辅助润色
        </h2>
        <p style="font-size: 20px; color: #333; line-height: 1.8; font-weight: 400">
          我们为您提供便捷的在线简历编辑工具，结合先进的AI技术对您的简历进行智能润色。
          无论是语言表达还是内容优化，都能帮助您的简历在众多候选人中脱颖而出。
          让您的职业发展更具竞争力，迈向成功的第一步。
        </p>
      </div>
      <div style="width: 45%; animation: fadeInRight 1s ease-in-out">
        <img
          src="/src/assets/imgs/show.png"
          alt="Feature 1"
          style="
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          "
        />
      </div>
    </div>

    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px;
        gap: 20px;
        flex-direction: row-reverse;
        margin-top: 100px;
      "
    >
      <div style="width: 50%; text-align: left; animation: fadeInRight 1s ease-in-out">
        <h2
          style="font-size: 36px; color: #0056b3; margin-bottom: 20px; font-weight: bold"
        >
          🧭 职业兴趣与价值观测评
        </h2>
        <p style="font-size: 20px; color: #333; line-height: 1.8; font-weight: 400">
          通过科学的职业兴趣与价值观测评，帮助您深入了解自己的职业倾向和核心价值观。
          让您在职业选择中更加自信，找到最适合自己的职业方向，实现个人与职业的完美契合。
        </p>
      </div>
      <div style="width: 45%; animation: fadeInLeft 1s ease-in-out">
        <img
          src="/src/assets/imgs/show1.png"
          alt="Feature 2"
          style="
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          "
        />
      </div>
    </div>

    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px;
        gap: 20px;
      "
    >
      <div style="width: 50%; text-align: left; animation: fadeInLeft 1s ease-in-out">
        <h2
          style="font-size: 36px; color: #0056b3; margin-bottom: 20px; font-weight: bold"
        >
          🌐 丰富企业资源
        </h2>
        <p style="font-size: 20px; color: #333; line-height: 1.8; font-weight: 400">
          我们整合了海量的企业资源，涵盖多个行业和领域，为您提供丰富的岗位信息。
          无论您是初入职场还是职业转型，都能快速找到理想的工作机会，助您实现职业目标。
        </p>
      </div>
      <div style="width: 45%; animation: fadeInRight 1s ease-in-out">
        <img
          src="/src/assets/imgs/show2.png"
          alt="Feature 3"
          style="
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          "
        />
      </div>
    </div>

    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px;
        gap: 20px;
        flex-direction: row-reverse;
        margin-top: 50px;
      "
    >
      <div style="width: 50%; text-align: left; animation: fadeInRight 1s ease-in-out">
        <h2
          style="font-size: 36px; color: #0056b3; margin-bottom: 20px; font-weight: bold"
        >
          🤖 AI模拟面试功能
        </h2>
        <p style="font-size: 20px; color: #333; line-height: 1.8; font-weight: 400">
          借助AI技术，我们为您提供真实的模拟面试体验。通过多种场景模拟，帮助您提升面试表现。
          无论是回答技巧还是心理准备，都能让您在实际面试中更加从容自信。
        </p>
      </div>
      <div style="width: 45%; animation: fadeInLeft 1s ease-in-out">
        <img
          src="/src/assets/imgs/show3.png"
          alt="Feature 4"
          style="
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          "
        />
      </div>
    </div>

    <div
      style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 40px;
        gap: 20px;
      "
    >
      <div style="width: 50%; text-align: left; animation: fadeInLeft 1s ease-in-out">
        <h2
          style="font-size: 36px; color: #0056b3; margin-bottom: 20px; font-weight: bold"
        >
          📊 模拟面试分析报告
        </h2>
        <p style="font-size: 20px; color: #333; line-height: 1.8; font-weight: 400">
          提供详细的模拟面试分析报告，帮助您了解自身的优势与不足。
          根据报告内容，制定针对性的提升计划，全面提升您的面试能力，助您成功拿下心仪的职位。
        </p>
      </div>
      <div style="width: 45%; animation: fadeInRight 1s ease-in-out">
        <img
          src="/src/assets/imgs/show4.png"
          alt="Feature 5"
          style="
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          "
        />
      </div>
    </div>
    <div
      style="
        background-color: #87ceeb;
        color: white;
        text-align: center;
        padding: 20px 0;
        margin-top: 50px;
      "
    >
      <p style="font-size: 18px; margin: 0">
        © 2025 CareerNavigator. All rights reserved. | Designed by CareerNavigator Team
        🚀✨
      </p>
    </div>
  </div>
</template>

<script setup>
function hoverEffect(event) {
  event.target.style.transform = "scale(1.1)";
}

function resetEffect(event) {
  event.target.style.transform = "scale(1)";
}
function scrollToSection() {
  const section = document.querySelector("#help-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style scoped>
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.logo:hover {
  color: #1e90ff;
  transition: color 0.3s ease;
  text-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
  cursor: pointer;
}
</style>
