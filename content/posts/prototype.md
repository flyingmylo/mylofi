---
title: "Javascript 之原型链"
summary: "巩固复习一下 Javascript 原型链的知识"
date: 2022-06-10T12:44:17+08:00
tags: ['Javascript']
slug: prototype
draft: false
---
```javascript

function SuperType() {
  this.property = true;
}
SuperType.prototype.getSuperValue = function() {
  return this.property;
}
function SubType() {
  this.subproperty = false;
}
//  修改 SubType 的原型，重新指向 SuperType 
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function() {
  return this.subproperty;
}
let instance = new SubType();
console.log(instance.getSuperValue()) // true
console.log(instance.getSubValue()) // false

```
![](2x.png "原型链")
