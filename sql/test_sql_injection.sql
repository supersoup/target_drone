/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : test_sql_injection

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-10-14 09:43:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `classes`
-- ----------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` bigint(20) NOT NULL COMMENT '编号',
  `name` varchar(20) DEFAULT NULL COMMENT '班级名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of classes
-- ----------------------------



INSERT INTO `classes` VALUES ('1', '19级1班');
INSERT INTO `classes` VALUES ('2', '19级2班');
INSERT INTO `classes` VALUES ('3', '20级1班');
INSERT INTO `classes` VALUES ('4', '20级2班');

-- ----------------------------
-- Table structure for `students`
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` bigint(20) NOT NULL COMMENT '学号',
  `id_no` char(18) NOT NULL COMMENT '身份证号',
  `name` varchar(10) NOT NULL COMMENT '姓名',
  `class_id` bigint(20) DEFAULT NULL COMMENT '所属班级',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES ('1', '510112199401010001', '张三', '1');
INSERT INTO `students` VALUES ('2', '510112199401010002', '李四', '1');
INSERT INTO `students` VALUES ('3', '510112199401010003', '王五', '1');
INSERT INTO `students` VALUES ('4', '510112199401010004', '赵六', '2');
INSERT INTO `students` VALUES ('5', '510112199401010005', '陈七', '2');
INSERT INTO `students` VALUES ('6', '510112199501010006', '刘备', '3');
INSERT INTO `students` VALUES ('7', '510112199501010007', '关羽', '3');
INSERT INTO `students` VALUES ('8', '510112199501010008', '张飞', '3');
