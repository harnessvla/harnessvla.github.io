# Frozen VLA + Simple Primitives，就能做强泛化机器人操作？Harness VLA 给出新答案

现有 VLA 在分布内任务上已经很强，但一旦进入分布外场景，成功率往往会明显下降，这也直接限制了 VLA 的泛化能力。

给它一个熟悉的目标、布局和局部观测，它可以抓起牛奶盒、把物体放进容器、操作抽屉或按钮。真正麻烦的是部署时的分布外变化：目标换了、篮子挪了、桌面布局变了，端到端 VLA 仍可能沿着训练时熟悉的轨迹执行，目标绑定和空间重定位一旦出错，后面的 rollout 就很容易偏掉。

清华大学于超老师团队的 **Harness VLA**，想解决的就是这个问题。

它没有重新训练一个 VLA，也没有给机器人塞进一个越来越大的技能库。它做的是另一件事：让 Codex / Claude Code 这样的 agent 学会调度一个 frozen VLA，把非接触的移动、对齐、释放交给简单解析原语，只在局部接触阶段调用 VLA。

这种分工带来的变化，直接体现在几个测试结果里。

在面对指令重定向和位置交换的 LIBERO-Pro 上，直接使用 RLinf frozen VLA 的整体成功率是 **50.0%**，Harness VLA 提升到 **82.4%**。

在更长程的 RoboCasa365 厨房任务中，RLDX-1 是 **30.0%**，Harness VLA 提升到 **55.4%**。

在双臂随机化迁移的 RoboTwin C2R 上，π0.5 是 **47.9%**，Harness VLA 达到 **58.4%**。

同时，在 standard LIBERO 上，Harness VLA 仍然保持 **96.0%**。这说明外层 agentic harness 并没有破坏 frozen VLA 原本会做的标准任务，而是把它带到了更适合发挥作用的位置。

> **这篇工作的核心是让 agent 学会怎么用好已有的 frozen VLA。**

## 项目资源

| 资源 | 链接 |
| --- | --- |
| 论文链接 | 即将更新 |
| 项目主页 | 即将更新 |
| GitHub | 即将更新 |
| Demo Video | 即将更新 |
| arXiv / OpenReview | 即将更新 |
| Hugging Face / Model / Data | 即将更新 |

## 01. VLA 到底卡在哪里？

先说清楚：VLA 不是不强。

它的强项很明确：局部接触控制。

抓取不规则物体、把物体放进狭窄容器、操作抽屉和按钮，这些接触丰富（contact-rich）的动作很难靠纯手写控制器稳定完成，反而是 VLA 更适合处理的部分。

真正的困难出现在整条任务被端到端交给 VLA 的时候。

一条完整任务不只有抓取和放置。它还包含：

- 语言理解；
- 目标绑定；
- 空间重定位；
- 长程组合；
- 低层接触控制。

一旦目标换了、布局变了、任务变长了，整条轨迹就可能离开训练分布；但模型仍然容易沿着训练时熟悉的行为继续执行。

所以瓶颈不在于 VLA 不会“抓”，而在于：

> **端到端 VLA 被迫把语义、几何、长程组合和接触控制都压进同一个策略里。**

LLM coding agent 刚好提供了互补能力：它擅长语言推理、任务拆解和程序组合；但如果只依赖解析控制接口，又很难稳定完成不规则抓取、受约束放置和铰接物体操作。

Harness VLA 的出发点不是替代 VLA，而是把这些责任重新分清楚：

> **VLA 做局部接触，解析原语做几何连接，agent 做组合决策。**

## 02. Harness VLA 怎么用 frozen VLA？

先看图 1。最重要的是中间的 Agentic Planner II 和右侧的 primitive library。

![Harness VLA 框架总览图](https://huanming99.github.io/harnessvla/wechat_assets/scheme_wechat.png)

*图 1：Agentic Planner II 根据任务、RGB-D 观测、机器人状态和记忆模块，在固定原语库里选择下一步动作。VLA 不再控制整条轨迹，而是作为 `VLA_ACT` 被按需调用。*

在 Harness VLA 里，agent 不直接输出底层关节动作，也不会在部署时发明新技能。它只能调用一个小而固定的原语库。

这个库故意很小。背后的设计判断是：不需要堆一大堆技能，只要 agent 学会怎么用好 frozen VLA，少量通用 primitive 也能撑起很强的泛化能力。

一类是解析原语：移动、对齐、调整末端姿态、控制夹爪、移动底盘、重新对准操作区域。

另一类是唯一的学习型原语：`VLA_ACT`。它调用 frozen VLA，负责抓取、放入、操作抽屉、水龙头、按钮等局部接触动作。

这样一来，VLA 不再是“从头控制到尾”的整体策略，而是变成一个可复用的精细操作专家。

这里的关键不是训练 VLA，而是让 agent 掌握 VLA 的调用条件：

> **什么时候调用，调用前怎么摆好机器人，调用后怎么接下一步。**

所以，关键不是“能不能调用 VLA”，而是 agent 是否学会了 VLA 的使用边界。

## 03. Simple primitives 为什么够用？

很多任务让端到端 VLA 难泛化，不是因为每一步都难，而是完整轨迹里混在一起的东西太多。

以“把牛奶盒放进篮子”为例。端到端做时，VLA 要同时完成目标识别、抓取、搬运、空间定位、放置和最终确认。

但拆开看，真正需要 VLA 的可能只有少数局部阶段：比如抓起牛奶盒，或者在受限空间里完成放置。

中间大量动作其实是几何连接：靠近目标、移动到篮子上方、调整高度和姿态、释放、再转到下一个区域。

这些步骤对端到端 VLA 来说可能是一条分布外轨迹；但对解析原语来说，只是可复用的移动、对齐和释放。

图 2 讲的就是这个分解：完整 rollout 可能已经离开 VLA 的训练分布，但其中很多非接触步骤只是移动、对齐和重定位。Harness VLA 用 simple primitives 处理这些步骤，把机器人带到更接近 VLA in-distribution 的局部接触状态，再调用 frozen VLA。

![Harness VLA 路径分解示意图](https://huanming99.github.io/harnessvla/wechat_assets/abstract_figure_wechat.jpg)

*图 2：非接触段由 simple primitives 处理，VLA 只在更接近 in-distribution 的局部接触状态附近出手。*

所以 simple primitives 泛化的不是复杂接触本身，而是任务中大量可复用的非接触连接。

因此，Harness VLA 并不要求 VLA 学会所有“从一个物体到另一个目标”的完整轨迹。VLA 只负责局部精细操作；非接触几何由解析原语完成；什么时候切换由 agent 决定。

原语使用统计也说明了这一点：

- LIBERO：解析原语占 **84.2%**，`VLA_ACT` 占 **15.8%**；
- RoboCasa365：解析原语占 **64.7%**，`VLA_ACT` 占 **35.3%**；
- RoboTwin C2R：解析原语占 **52.6%**，`VLA_ACT` 占 **47.4%**。

这组数字说明，VLA 不是整条轨迹的主控器，而是被稀疏地调用在关键接触点上。也正因为如此，一个小原语库就够用：它承担的是任务中大量可复用的结构，而不是替代 VLA 做精细操作。

## 04. Memory 记住的不是坐标，而是任务结构

Harness VLA 不是在 memory 里记一串固定坐标。

Task Specific Memory 记的是任务结构：先找谁、先去哪里、什么时候让 VLA 出手、接触后怎么搬运、什么时候释放。

Global Memory 记的是跨任务经验：哪些接触阶段适合交给 VLA，哪些看起来接近目标但其实没有完成任务，哪些接触前准备更稳定。

所以 few-shot 之后，agent 复用的不是“某条固定轨迹”，而是：

> **复用任务结构，重新绑定当前几何。**

这点在扰动任务里很关键。目标换了、位置换了，agent 需要先重新定位当前任务里的目标，再决定接下来怎么调用原语和 VLA。

![LIBERO-Pro 扰动示例](https://huanming99.github.io/harnessvla/wechat_assets/a.png)

*图 3：LIBERO-Pro 中的目标重定向和布局交换示例。端到端 RLinf 容易复现标准任务里的熟悉行为；Harness VLA 会重新绑定当前目标，用解析原语完成 staging，再在合适位置调用 `VLA_ACT`。*

## 05. 效果为什么能涨这么多？

这里要先区分两件事。

Harness VLA 确实可能在一个任务里多次调用 `VLA_ACT`，但这不是把 VLA 当连续控制器反复跑。关键在于：每次调用都是 planner 选出来的局部尝试，调用前后都有观察、staging 和验证。

第一，`VLA_ACT` 被拆成少量局部精细操作尝试。

端到端 frozen VLA 通常是一条 rollout 从头走到尾。前面目标绑定或局部接触一旦不理想，后面就很容易继续偏下去。

Harness VLA 不这样用 VLA。调用 `VLA_ACT` 之前，agent 会先用解析原语完成 staging：调整末端位置、改变 approach pose、对齐目标区域，把机器人放到更适合 VLA 发挥的局部状态。调用之后，agent 继续观察结果；如果局部接触不稳定，就重新调整位姿，再发起下一次局部调用。

![自适应调用 VLA 的执行示例](https://huanming99.github.io/harnessvla/wechat_assets/b.png)

*图 4：两个自适应调用 VLA 的 rollout 示例。VLA 调用不是连续控制，而是 planner 在导航、staging 和验证之间选择的局部接触尝试；局部结果不稳定时，会重新调整位姿后再调用 `VLA_ACT`。*

图 5 把这个机制量化了：相比直接把 frozen VLA 当作端到端策略跑，Harness VLA 允许 planner 在一个任务里发起少量 staged VLA 调用，成功率会明显上升。

![经过准备后的 VLA 调用分析](https://huanming99.github.io/harnessvla/wechat_assets/e.jpg)

*图 5：横轴是每个任务最多允许调用 `VLA_ACT` 的次数。相比直接运行 frozen VLA 的基线，少量经过 planner staging 的局部 VLA 调用就能把成功率明显推高，并逐渐接近完整 Harness VLA。*

第二，解析原语把 VLA 调用之间的非接触结构接起来。

解析原语不替代 VLA 做精细操作。它们负责的是接触前后的自由移动、姿态调整、释放、导航和重新定位。这样，VLA 不需要承担完整长程轨迹，只需要处理真正需要视觉闭环和接触控制的局部阶段。

![接触阶段周围的解析分解](https://huanming99.github.io/harnessvla/wechat_assets/c.png)

*图 6：两个 rollout 例子展示了解析原语如何围绕接触阶段工作。`VLA_ACT` 负责抓取、放入等局部精细操作；解析原语负责在接触前后完成重新定位、搬运、推入和收尾。*

任务完成归因图也能看到这种分工。

![任务完成归因：解析原语和 VLA 原语](https://huanming99.github.io/harnessvla/wechat_assets/d.jpg)

*图 7：成功 rollout 的最后完成信号来自哪类 primitive。LIBERO 系列任务多在 VLA 建立稳定接触后由解析原语收尾；RoboCasa365 和 RoboTwin C2R 中，设备操作、受限放置和双臂交互更多依赖 VLA primitive。*

所以这一节的结论不是“调用次数越多越好”，而是：

> **Harness VLA 把一次长程端到端控制，改成少量经过 staging 的局部 VLA 调用，再用简单解析原语把这些局部阶段接起来。**

## 06. 三个测试榜单上，泛化都变强了

实验结果最直接地说明了这件事：Harness VLA 不是只在某一种扰动上有效。

在 **LIBERO-Pro** 上，任务会出现指令重定向和位置交换。直接使用 RLinf frozen VLA，整体成功率是 **50.0%**；放进 Harness VLA 后，提升到 **82.4%**。这是最核心的一组结果，因为底层 VLA 没变，变化的是 agent 如何使用它。

在 **RoboCasa365** 上，任务变成长程厨房操作。机器人需要移动底盘、操作厨房部件，还要把多个短技能组合起来。RLDX-1 是 **30.0%**，Harness VLA (Codex) 提升到 **55.4%**。

在 **RoboTwin C2R** 上，测试的是双臂从干净场景到随机化场景的迁移。π0.5 是 **47.9%**，Harness VLA (CC) 达到 **58.4%**。

这三组结果对应三种不同压力：扰动、长程、迁移。共同说明的是，同一个思路可以把 frozen VLA 扩展到更复杂的任务分布里。

作为补充，在 **standard LIBERO** 上，RLinf frozen VLA 是 **95.3%**，Harness VLA (CC) 是 **96.0%**。这说明外层 harness 没有牺牲 VLA 原本的分布内能力。

更进一步，zero-shot 设置也说明它不是简单复读 memory。在没有对应目标场景任务记忆的情况下，LIBERO-Pro Goal 的 Task-T 从 Cap-X 的 **16.8%** 提升到 Harness VLA (CC) 的 **79.0%**。

## 07. Harness VLA 和更强 VLA 并不矛盾

当然可以继续训练更强的 VLA。

但 Harness VLA 想说明的是：VLA 的能力不只取决于模型本身，也取决于它被放在什么样的执行系统里。

如果底层 VLA 更强，它在局部精细操作上的能力也会更强；而 Harness VLA 仍然可以继续把这个能力放到更合适的状态、更合适的时机去调用。

所以二者不是替代关系，而是互补关系：

> **局部接触交给 VLA，空间几何交给原语，任务组合交给 agent。**

Harness VLA 的优势在于，它不要求每一次泛化都靠重新训练模型来解决。即使用 frozen VLA，也可以通过 agentic harness，把已有的局部能力扩展到更长程、更扰动、更复杂的任务里。

这就是 Harness VLA 的 simple but effective：

> **用一个固定的小原语库，把 frozen VLA 的局部接触能力扩展成跨任务、跨布局、跨场景的泛化能力。**
