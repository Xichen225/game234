import { useState, useEffect } from 'react'
import { CssBaseline, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import './App.css'
import EquipmentSelection from './components/EquipmentSelection'
import GameScreen from './components/GameScreen'

// 创建Material UI主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 难度等级定义
const DIFFICULTY_LEVELS = {
  EASY: '简单',
  NORMAL: '中等',
  HARD: '困难',
  EXPERT: '高难'
};

// 初始化装备数据
const initialEquipmentDatabase = {
  head: [
    { id: 'head1', name: '火焰头盔', resistance: 'fire', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
    { id: 'head2', name: '风暴头盔', resistance: 'storm', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
    { id: 'head3', name: '寒冰头盔', resistance: 'ice', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
  ],
  body: [
    { id: 'body1', name: '火焰护甲', resistance: 'fire', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
    { id: 'body2', name: '风暴护甲', resistance: 'storm', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
    { id: 'body3', name: '寒冰护甲', resistance: 'ice', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
  ],
  feet: [
    { id: 'feet1', name: '火焰靴子', resistance: 'fire', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
    { id: 'feet2', name: '风暴靴子', resistance: 'storm', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
    { id: 'feet3', name: '寒冰靴子', resistance: 'ice', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
  ]
};

// 初始化完成勋章数据
const initialAchievements = {
  [DIFFICULTY_LEVELS.EASY]: 0,
  [DIFFICULTY_LEVELS.NORMAL]: 0,
  [DIFFICULTY_LEVELS.HARD]: 0,
  [DIFFICULTY_LEVELS.EXPERT]: 0
};

function App() {
  // 游戏状态
  const [gameStarted, setGameStarted] = useState(false);

  // 添加游戏失败对话框状态
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // 添加生命值状态到App组件
  const [playerHealth, setPlayerHealth] = useState(() => {
    const savedHealth = localStorage.getItem('playerHealth');
    return savedHealth ? parseInt(savedHealth) : 1000;
  });

  // 监听生命值变化并保存
  useEffect(() => {
    localStorage.setItem('playerHealth', playerHealth.toString());
  }, [playerHealth]);

  // 游戏结束处理函数
  const handleGameOver = () => {
    // 设置游戏结束状态到localStorage以确保刷新页面时能恢复状态
    localStorage.setItem('gameOverState', 'true');
    // 显示游戏结束对话框
    setShowGameOverDialog(true);
  };

  // 初始检查游戏结束状态
  useEffect(() => {
    // 检查localStorage中是否有游戏结束标志，并且确认生命值是否真的为0
    const isGameOver = localStorage.getItem('gameOverState') === 'true';
    const health = parseInt(localStorage.getItem('playerHealth') || '1000');

    if (isGameOver || health <= 0) {
      // 清除游戏结束标志
      localStorage.removeItem('gameOverState');
      // 显示游戏结束对话框
      setShowGameOverDialog(true);
    }
  }, []);

  // 装备数据库（所有可用装备的完整状态）
  const [equipmentDatabase, setEquipmentDatabase] = useState(() => {
    // 从本地存储加载装备数据
    const savedEquipment = localStorage.getItem('equipmentDatabase');
    return savedEquipment ? JSON.parse(savedEquipment) : initialEquipmentDatabase;
  });

  // 当前选择的装备
  const [selectedEquipment, setSelectedEquipment] = useState({
    head: null,
    body: null,
    feet: null
  });

  // 当前选择的难度
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    // 从本地存储加载上次选择的难度
    const savedDifficulty = localStorage.getItem('selectedDifficulty');
    return savedDifficulty || DIFFICULTY_LEVELS.EASY;
  });

  // 完成勋章
  const [achievements, setAchievements] = useState(() => {
    // 从本地存储加载完成勋章数据
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : initialAchievements;
  });

  // 地图数据，存储困难和高难模式的固定地图
  const [mapData, setMapData] = useState(null);
  const [hardModeMap, setHardModeMap] = useState(() => {
    const savedMap = localStorage.getItem('hardModeMap');
    return savedMap ? JSON.parse(savedMap) : null;
  });
  const [expertModeMap, setExpertModeMap] = useState(() => {
    const savedMap = localStorage.getItem('expertModeMap');
    return savedMap ? JSON.parse(savedMap) : null;
  });

  // 保存装备数据到本地存储
  useEffect(() => {
    localStorage.setItem('equipmentDatabase', JSON.stringify(equipmentDatabase));
  }, [equipmentDatabase]);

  // 保存完成勋章数据到本地存储
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  // 保存选择的难度到本地存储
  useEffect(() => {
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
  }, [selectedDifficulty]);

  // 保存困难和高难模式的地图数据
  useEffect(() => {
    if (hardModeMap) {
      localStorage.setItem('hardModeMap', JSON.stringify(hardModeMap));
    }
  }, [hardModeMap]);

  useEffect(() => {
    if (expertModeMap) {
      localStorage.setItem('expertModeMap', JSON.stringify(expertModeMap));
    }
  }, [expertModeMap]);

  // 处理难度变更
  const handleDifficultyChange = (newDifficulty) => {
    setSelectedDifficulty(newDifficulty);

    // 根据不同难度设置地图
    if (newDifficulty === DIFFICULTY_LEVELS.HARD) {
      // 困难模式：使用保存的地图或生成新地图
      if (hardModeMap) {
        setMapData(hardModeMap);
      } else {
        const newMap = generateMap(newDifficulty);
        setMapData(newMap);
        setHardModeMap(newMap);
      }
    } else if (newDifficulty === DIFFICULTY_LEVELS.EXPERT) {
      // 高难模式：使用保存的地图或生成新地图
      if (expertModeMap) {
        setMapData(expertModeMap);
      } else {
        const newMap = generateMap(newDifficulty);
        setMapData(newMap);
        setExpertModeMap(newMap);
      }
    } else {
      // 简单和中等难度：生成新地图
      setMapData(generateMap(newDifficulty));
    }
  };

  // 开始游戏
  const startGame = () => {
    setGameStarted(true);
  };

  // 返回装备选择界面
  const returnToSelection = () => {
    setGameStarted(false);
  };

  // 更新装备经验值并检查升级
  const updateEquipmentExp = (slot, itemId, expGained) => {
    setEquipmentDatabase(prevDatabase => {
      const newDatabase = {...prevDatabase};

      // 找到要更新的装备
      const itemIndex = newDatabase[slot].findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevDatabase;

      const item = {...newDatabase[slot][itemIndex]};

      // 增加经验值
      item.exp += expGained;

      // 检查是否升级
      if (item.exp >= item.expToNextLevel) {
        item.level += 1;
        item.exp = item.exp - item.expToNextLevel;
        item.expToNextLevel = Math.floor(item.expToNextLevel * 1.5); // 下一级所需经验值增加
      }

      // 更新数据库中的装备
      newDatabase[slot][itemIndex] = item;

      return newDatabase;
    });
  };

  // 获取难度对应的经验值奖励和地块等级概率
  const getDifficultySettings = (difficulty) => {
    switch(difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return {
          expReward: 30,
          levelProbabilities: [0.7, 0.2, 0.1], // 1级、2级、3级地块的概率
        };
      case DIFFICULTY_LEVELS.NORMAL:
        return {
          expReward: 50,
          levelProbabilities: [0.4, 0.4, 0.2],
        };
      case DIFFICULTY_LEVELS.HARD:
        return {
          expReward: 80,
          levelProbabilities: [0.2, 0.4, 0.4],
        };
      case DIFFICULTY_LEVELS.EXPERT:
        return {
          expReward: 120,
          levelProbabilities: [0.1, 0.3, 0.6],
        };
      default:
        return {
          expReward: 50,
          levelProbabilities: [0.4, 0.4, 0.2],
        };
    }
  };

  // 根据选择的难度生成地图
  const generateMap = (difficulty = selectedDifficulty) => {
    const terrainTypes = ['fire', 'storm', 'ice'];
    const rows = 5;
    const cols = 6;
    const map = [];

    // 根据难度获取地块等级概率
    const { levelProbabilities } = getDifficultySettings(difficulty);

    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        // 起点和终点没有地形效果
        if ((row === rows - 1 && col === 0) || (row === 0 && col === cols - 1)) {
          currentRow.push({
            type: 'normal',
            level: 0,
            isStart: row === rows - 1 && col === 0,
            isEnd: row === 0 && col === cols - 1
          });
        } else {
          const type = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];

          // 根据概率决定地块等级
          const randomValue = Math.random();
          let level;
          if (randomValue < levelProbabilities[0]) {
            level = 1;
          } else if (randomValue < levelProbabilities[0] + levelProbabilities[1]) {
            level = 2;
          } else {
            level = 3;
          }

          currentRow.push({ type, level });
        }
      }
      map.push(currentRow);
    }

    return map;
  };

  // 重新生成地图（仅允许在简单和中等难度下使用）
  const regenerateMap = () => {
    // 只有简单和中等难度允许手动刷新地图
    if (selectedDifficulty === DIFFICULTY_LEVELS.EASY || selectedDifficulty === DIFFICULTY_LEVELS.NORMAL) {
      setMapData(generateMap());
    }
  };

  // 在游戏胜利后刷新地图并更新装备经验值和完成勋章
  const handleGameVictory = () => {
    // 恢复500点生命值，但不超过1000
    const newHealth = Math.min(playerHealth + 300, 1000);
    setPlayerHealth(newHealth);

    // 更新完成勋章（累加通关次数）
    setAchievements(prev => ({
      ...prev,
      [selectedDifficulty]: (prev[selectedDifficulty] || 0) + 1
    }));

    // 临时存储需要更新的装备ID，用于后续更新selectedEquipment
    const updatedEquipmentIds = {
      head: selectedEquipment.head?.id,
      body: selectedEquipment.body?.id,
      feet: selectedEquipment.feet?.id
    };

    // 根据难度获取经验值奖励
    const { expReward } = getDifficultySettings(selectedDifficulty);

    // 所有使用的装备获得经验值
    if (selectedEquipment.head) {
      updateEquipmentExp('head', selectedEquipment.head.id, expReward);
    }
    if (selectedEquipment.body) {
      updateEquipmentExp('body', selectedEquipment.body.id, expReward);
    }
    if (selectedEquipment.feet) {
      updateEquipmentExp('feet', selectedEquipment.feet.id, expReward);
    }

    // 更新selectedEquipment，确保它引用最新的装备数据
    setTimeout(() => {
      const updatedSelectedEquipment = {
        head: updatedEquipmentIds.head ? equipmentDatabase.head.find(item => item.id === updatedEquipmentIds.head) : null,
        body: updatedEquipmentIds.body ? equipmentDatabase.body.find(item => item.id === updatedEquipmentIds.body) : null,
        feet: updatedEquipmentIds.feet ? equipmentDatabase.feet.find(item => item.id === updatedEquipmentIds.feet) : null
      };

      setSelectedEquipment(updatedSelectedEquipment);
    }, 0);

    // 生成新地图
    const newMap = generateMap();
    setMapData(newMap);

    // 如果是困难或高难模式，更新固定地图
    if (selectedDifficulty === DIFFICULTY_LEVELS.HARD) {
      setHardModeMap(newMap);
    } else if (selectedDifficulty === DIFFICULTY_LEVELS.EXPERT) {
      setExpertModeMap(newMap);
    }

    // 返回装备选择界面
    setGameStarted(false);
  };

  // 重置所有装备数据和完成勋章（开发测试用）
  const resetData = () => {
    // 创建一个全新的装备数据副本，确保经验值被重置为0
    const freshEquipmentDatabase = {
      head: [
        { id: 'head1', name: '火焰头盔', resistance: 'fire', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
        { id: 'head2', name: '风暴头盔', resistance: 'storm', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
        { id: 'head3', name: '寒冰头盔', resistance: 'ice', baseValue: 3, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
      ],
      body: [
        { id: 'body1', name: '火焰护甲', resistance: 'fire', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
        { id: 'body2', name: '风暴护甲', resistance: 'storm', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
        { id: 'body3', name: '寒冰护甲', resistance: 'ice', baseValue: 2, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
      ],
      feet: [
        { id: 'feet1', name: '火焰靴子', resistance: 'fire', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '🔥' },
        { id: 'feet2', name: '风暴靴子', resistance: 'storm', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '🌪️' },
        { id: 'feet3', name: '寒冰靴子', resistance: 'ice', baseValue: 1, level: 1, exp: 0, expToNextLevel: 100, image: '❄️' }
      ]
    };

    setEquipmentDatabase(freshEquipmentDatabase);
    setAchievements(initialAchievements);
    setHardModeMap(null);
    setExpertModeMap(null);
    localStorage.removeItem('equipmentDatabase');
    localStorage.removeItem('achievements');
    localStorage.removeItem('hardModeMap');
    localStorage.removeItem('expertModeMap');
    localStorage.removeItem('playerHealth'); // 重置玩家生命值
    localStorage.removeItem('gameOverState'); // 清除游戏结束状态

    // 重置生命值
    setPlayerHealth(1000);

    // 重置所选装备
    setSelectedEquipment({
      head: null,
      body: null,
      feet: null
    });

    // 生成新地图
    setMapData(generateMap());
  };

  // 初始化游戏 - 在组件挂载时加载地图
  useEffect(() => {
    if (!mapData) {
      if (selectedDifficulty === DIFFICULTY_LEVELS.HARD && hardModeMap) {
        setMapData(hardModeMap);
      } else if (selectedDifficulty === DIFFICULTY_LEVELS.EXPERT && expertModeMap) {
        setMapData(expertModeMap);
      } else {
        const newMap = generateMap();
        setMapData(newMap);

        // 如果是困难或高难模式，保存地图
        if (selectedDifficulty === DIFFICULTY_LEVELS.HARD) {
          setHardModeMap(newMap);
        } else if (selectedDifficulty === DIFFICULTY_LEVELS.EXPERT) {
          setExpertModeMap(newMap);
        }
      }
    }
  }, []);

  // 处理游戏结束对话框关闭
  const handleGameOverDialogClose = () => {
    setShowGameOverDialog(false);
    resetData();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="game-container">
        {!gameStarted ? (
          <EquipmentSelection
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={setSelectedEquipment}
            equipmentDatabase={equipmentDatabase}
            mapData={mapData}
            setMapData={setMapData}
            startGame={startGame}
            resetData={resetData}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={handleDifficultyChange}
            refreshMap={regenerateMap}
            achievements={achievements}
            difficultyLevels={DIFFICULTY_LEVELS}
            playerHealth={playerHealth} // 传递生命值给装备选择界面
          />
        ) : (
          <GameScreen
            selectedEquipment={selectedEquipment}
            mapData={mapData}
            returnToSelection={returnToSelection}
            onGameVictory={handleGameVictory}
            difficulty={selectedDifficulty}
            playerHealth={playerHealth} // 传递生命值
            setPlayerHealth={setPlayerHealth} // 传递设置生命值的函数
            handleGameOver={handleGameOver}
          />
        )}

        {/* 游戏失败对话框 */}
        <Dialog
          open={showGameOverDialog}
          onClose={handleGameOverDialogClose}
          aria-labelledby="game-over-dialog-title"
        >
          <DialogTitle id="game-over-dialog-title">游戏结束</DialogTitle>
          <DialogContent>
            <Typography>
              你的生命值已耗尽！所有游戏数据将被重置。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGameOverDialogClose} color="primary" autoFocus>
              重新开始
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

export default App
