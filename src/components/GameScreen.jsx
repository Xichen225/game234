import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';

const GameScreen = ({ selectedEquipment, mapData, returnToSelection, onGameVictory, difficulty, playerHealth, setPlayerHealth, handleGameOver }) => {
  // 状态
  const [playerPosition, setPlayerPosition] = useState({ row: 4, col: 0 }); // 左下角
  const [health, setHealth] = useState(playerHealth); // 使用传入的生命值
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  // 添加伤害提示状态
  const [damageAlert, setDamageAlert] = useState({ open: false, message: '', severity: 'error' });
  // 添加控制禁用状态
  const [disableControls, setDisableControls] = useState(false);

  // 当playerHealth改变时更新本地状态
  useEffect(() => {
    setHealth(playerHealth);
  }, [playerHealth]);

  // 当本地健康状态改变时通知父组件
  useEffect(() => {
    setPlayerHealth(health);
  }, [health, setPlayerHealth]);

  // 获取难度对应的颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单':
        return '#4caf50'; // 绿色
      case '中等':
        return '#2196f3'; // 蓝色
      case '困难':
        return '#ff9800'; // 橙色
      case '高难':
        return '#f44336'; // 红色
      default:
        return '#757575'; // 灰色
    }
  };

  // 计算装备的实际抗性值（基础值 + 等级加成）
  const calculateItemResistance = (item) => {
    if (!item) return 0;
    // 每级提供基础值的10%额外加成
    const levelBonus = item.baseValue * 0.1 * (item.level - 1);
    return item.baseValue + levelBonus;
  };

  // 计算玩家的抗性等级
  const calculateResistanceLevels = () => {
    const resistances = {
      fire: 0,
      storm: 0,
      ice: 0
    };

    // 计算每种类型的装备抗性，考虑装备基础值和等级加成
    if (selectedEquipment.head?.resistance === 'fire') {
      resistances.fire += calculateItemResistance(selectedEquipment.head);
    }
    if (selectedEquipment.body?.resistance === 'fire') {
      resistances.fire += calculateItemResistance(selectedEquipment.body);
    }
    if (selectedEquipment.feet?.resistance === 'fire') {
      resistances.fire += calculateItemResistance(selectedEquipment.feet);
    }

    if (selectedEquipment.head?.resistance === 'storm') {
      resistances.storm += calculateItemResistance(selectedEquipment.head);
    }
    if (selectedEquipment.body?.resistance === 'storm') {
      resistances.storm += calculateItemResistance(selectedEquipment.body);
    }
    if (selectedEquipment.feet?.resistance === 'storm') {
      resistances.storm += calculateItemResistance(selectedEquipment.feet);
    }

    if (selectedEquipment.head?.resistance === 'ice') {
      resistances.ice += calculateItemResistance(selectedEquipment.head);
    }
    if (selectedEquipment.body?.resistance === 'ice') {
      resistances.ice += calculateItemResistance(selectedEquipment.body);
    }
    if (selectedEquipment.feet?.resistance === 'ice') {
      resistances.ice += calculateItemResistance(selectedEquipment.feet);
    }

    return resistances;
  };

  // 处理键盘输入
  const handleKeyDown = useCallback((e) => {
    if (gameOver || gameWon || disableControls) return;

    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    // WASD 移动
    switch (e.key.toLowerCase()) {
      case 'w':
        newRow = Math.max(0, row - 1);
        break;
      case 's':
        newRow = Math.min(4, row + 1);
        break;
      case 'a':
        newCol = Math.max(0, col - 1);
        break;
      case 'd':
        newCol = Math.min(5, col + 1);
        break;
      default:
        return;
    }

    // 如果位置发生变化，更新玩家位置并计算伤害
    if (newRow !== row || newCol !== col) {
      setPlayerPosition({ row: newRow, col: newCol });
      calculateDamage(newRow, newCol);

      // 检查是否到达终点
      if (newRow === 0 && newCol === 5) {
        setGameWon(true);
      }
    }
  }, [playerPosition, gameOver, gameWon, disableControls]);

  // 计算伤害
  const calculateDamage = (row, col) => {
    const cell = mapData[row][col];

    // 如果是起点或终点，没有伤害
    if (cell.isStart || cell.isEnd) return;

    // 获取玩家的抗性等级
    const resistances = calculateResistanceLevels();

    // 获取当前单元格对应属性的抗性等级
    let resistance = 0;
    if (cell.type === 'fire') {
      resistance = resistances.fire;
    } else if (cell.type === 'storm') {
      resistance = resistances.storm;
    } else if (cell.type === 'ice') {
      resistance = resistances.ice;
    }

    // 计算实际伤害
    const baseDamage = cell.level * 12 * (3**cell.level);
    let actualDamage = Math.max(0, (baseDamage - (resistance * 12)) * (1-(2**-Math.max(0,(8-resistance)))*resistance));
    actualDamage = Math.round(actualDamage);

    if (actualDamage > 0) {
      const typeText = cell.type === 'fire' ? '炎热' : cell.type === 'storm' ? '风暴' : '寒冰';

      // 显示伤害信息
      const resistanceText = ` (抗性值: ${resistance.toFixed(1)})`;
      const message = `受到${typeText}${cell.level}级地块的${actualDamage}点伤害！${resistanceText}`;

      // 显示提示
      setDamageAlert({
        open: true,
        message: message,
        severity: 'warning'
      });

      // 减少生命值
      const newHealth = Math.max(0, health - actualDamage);
      setHealth(newHealth);

      // 检查是否游戏结束
      if (newHealth <= 0) {
        setGameOver(true);
        // 禁用控制
        setDisableControls(true);
        // 先显示伤害提示，延迟一段时间再结束游戏
        setTimeout(() => {
          // 不再设置对话框，而是直接返回选择界面并调用游戏结束处理
          returnToSelection();
          // 直接通知父组件处理游戏结束逻辑
          handleGameOver();
        }, 1500); // 延迟1.5秒，让玩家有时间看到致命伤害提示
      }
    } else if (resistance >= cell.level) {
      // 完全抵消伤害的提示
      const typeText = cell.type === 'fire' ? '炎热' : cell.type === 'storm' ? '风暴' : '寒冰';
      setDamageAlert({
        open: true,
        message: `你的${resistance.toFixed(1)}级${typeText}抗性完全抵消了伤害！`,
        severity: 'success'
      });
    }
  };

  // 添加键盘事件监听器
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 获取地块样式
  const getCellStyle = (cell) => {
    if (cell.isStart) {
      return 'start-cell';
    } else if (cell.isEnd) {
      return 'end-cell';
    } else {
      const typeClass = cell.type === 'fire' ? 'fire' : cell.type === 'storm' ? 'storm' : 'ice';
      return `${typeClass}-${cell.level}`;
    }
  };

  // 获取地块显示内容
  const getCellContent = (cell) => {
    if (cell.isStart) {
      return '起点';
    } else if (cell.isEnd) {
      return '终点';
    } else {
      const typeText = cell.type === 'fire' ? '炎热' : cell.type === 'storm' ? '风暴' : '寒冰';
      return `${typeText}${cell.level}`;
    }
  };

  // 获取地块显示图标
  const getCellIcon = (cell) => {
    if (cell.isStart || cell.isEnd) {
      return '';
    } else if (cell.type === 'fire') {
      return '🔥';
    } else if (cell.type === 'storm') {
      return '🌪️';
    } else {
      return '❄️';
    }
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    // setDialogOpen(false);
  };

  // 关闭伤害提示
  const handleCloseAlert = () => {
    setDamageAlert(prev => ({ ...prev, open: false }));
  };

  // 重新开始游戏
  const restartGame = () => {
    // 如果是胜利状态，则调用胜利回调函数（生命值在App组件中恢复）
    if (gameWon && onGameVictory) {
      onGameVictory();
    } else {
      returnToSelection();
    }
  };

  // 获取玩家的抗性信息
  const playerResistances = calculateResistanceLevels();

  // 格式化抗性值显示，保留一位小数
  const formatResistance = (value) => {
    return Math.round(value * 10) / 10;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pl:4,pr:4}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={difficulty}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: getDifficultyColor(difficulty)
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>生命:</Typography>
          <Box sx={{ width: 200 }}>
            <LinearProgress
              variant="determinate"
              value={health / 10}
              color={health > 500 ? 'success' : health > 200 ? 'warning' : 'error'}
              sx={{ height: 15, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body1" sx={{ ml: 1 }}>{health}/1000</Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={returnToSelection}
            sx={{ ml: 3 }}
          >
            返回
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            使用 W（上）S（下）A（左）D（右）键移动角色，到达终点。
          </Typography>
        </Box>
      </Paper>

      {/* 游戏地图 */}
      <Box sx={{display:'flex',padding:'24px'}}>
        <Box sx={{mr:2}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>装备与抗性：</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Typography variant="body2">
                头部：{selectedEquipment.head?.name || '无'}
                {selectedEquipment.head && ` Lv.${selectedEquipment.head.level}`}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                身体：{selectedEquipment.body?.name || '无'}
                {selectedEquipment.body && ` Lv.${selectedEquipment.body.level}`}
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                足部：{selectedEquipment.feet?.name || '无'}
                {selectedEquipment.feet && ` Lv.${selectedEquipment.feet.level}`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                  label={`炎热抗性：${formatResistance(playerResistances.fire)}`}
                  color={playerResistances.fire > 0 ? 'error' : 'default'}
                  variant={playerResistances.fire > 0 ? 'filled' : 'outlined'}
                  size="small"
              />
              <Chip
                  label={`风暴抗性：${formatResistance(playerResistances.storm)}`}
                  color={playerResistances.storm > 0 ? 'warning' : 'default'}
                  variant={playerResistances.storm > 0 ? 'filled' : 'outlined'}
                  size="small"
              />
              <Chip
                  label={`寒冰抗性：${formatResistance(playerResistances.ice)}`}
                  color={playerResistances.ice > 0 ? 'primary' : 'default'}
                  variant={playerResistances.ice > 0 ? 'filled' : 'outlined'}
                  size="small"
              />
            </Box>
          </Paper>
        </Box>
        <Box className="game-map">
          {mapData.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                  <Paper
                      key={`${rowIndex}-${colIndex}`}
                      className={`real-map-cell ${getCellStyle(cell)}`}
                      elevation={1}
                  >
                    <span className="cell-content">{getCellContent(cell)}</span>
                    <span className="cell-icon">{getCellIcon(cell)}</span>
                    {playerPosition.row === rowIndex && playerPosition.col === colIndex && (
                        <img src="/assets/113136114_p0.png" alt="player"
                        style={{position:'absolute',width:'80px',height:'80px',borderRadius:'10px'}}/>
                    )}
                    {/*<img src="src/assets/IMG_1462.GIF" alt="123" style={{width:'110px', height:'110px'}}/>*/}
                  </Paper>
              ))
          ))}
        </Box>
      </Box>

      {/* 非侵入式伤害提示 */}
      <Snackbar
        open={damageAlert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={damageAlert.severity} sx={{ width: '100%' }}>
          {damageAlert.message}
        </Alert>
      </Snackbar>

      {/* 游戏胜利对话框 */}
      <Dialog open={gameWon} onClose={handleCloseDialog}>
        <DialogTitle>
          {`胜利(${difficulty})`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            恭喜你成功到达终点，
            生命值恢复了300
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={restartGame} color="primary">
            继续
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameScreen;
