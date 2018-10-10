# transform-protocol
基于node.js实现的一种通用性的接口协议转换服务

```

CREATE TABLE `tp_template` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '转换模版ID',
  `title` varchar(255) DEFAULT NULL COMMENT '模版标题',
  `template` varchar(1024) DEFAULT NULL COMMENT '转换模版',
  `data_type` varchar(20) DEFAULT NULL COMMENT '模版数据类型eg: xml json raw ...',
  `description` varchar(255) DEFAULT NULL COMMENT '描述信息',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


```
