
objTypes['cropbox'] = {

  //顯示屬性方塊 Show the property box
  p_box: function(obj, elem) {
    var width = graphs.length(obj.p1, obj.p2);
    var height = graphs.length(obj.p1, obj.p3);
    createNumberAttr(getMsg('cropbox_size'), 0, 1000, 1, width, function(obj, value) {
      obj.p2 = graphs.point(obj.p1.x + 1*value, obj.p2.y);
      obj.p4 = graphs.point(obj.p3.x + 1*value, obj.p4.y);
    }, elem, null, true);
    createNumberAttr('x', 0, 1000, 1, height, function(obj, value) {
      obj.p3 = graphs.point(obj.p3.x, obj.p1.y + 1*value);
      obj.p4 = graphs.point(obj.p4.x, obj.p2.y + 1*value);
    }, elem, null, true);
    createDropdownAttr(getMsg('image_format'), obj.format, {
      'png': 'PNG',
      'svg': 'SVG'
    }, function(obj, value) {
      obj.format = value;
      selectObj(selectedObj);
    }, elem);


    if (obj.format != 'svg') {
      createNumberAttr(getMsg('image_width'), 0, 1000, 1, obj.width, function(obj, value) {
        obj.width = 1*value;
      }, elem, null, true);
    } else {
      createInfoBox(elem, getMsg('export_svg_popover'))
    }

    createButton(getMsg('save'), function(obj) {
      if (obj.format == 'svg') {
        exportSVG(obj);
      } else {
        exportImage(obj);
      }
    }, elem);
    createButton(getMsg('save_cancel'), function(obj) {
      cropMode = false;
      selectObj(-1);
      draw(true, true);
    }, elem);
  },

  //平移物件 Move the object
  move: function(obj, diffX, diffY) {
    obj.p1.x = obj.p1.x + diffX;
    obj.p1.y = obj.p1.y + diffY;
    obj.p2.x = obj.p2.x + diffX;
    obj.p2.y = obj.p2.y + diffY;
    obj.p3.x = obj.p3.x + diffX;
    obj.p3.y = obj.p3.y + diffY;
    obj.p4.x = obj.p4.x + diffX;
    obj.p4.y = obj.p4.y + diffY;
    return obj;
  },


  //繪圖區被按下時(判斷物件被按下的部分) When the drawing area is clicked (test which part of the obj is clicked)
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (!cropMode) return false;

    // Top left
    if (mouseOnPoint(mouse_nogrid, obj.p1)) {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      draggingPart.cursor = 'nwse-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Top right
    if (mouseOnPoint(mouse_nogrid, obj.p2)) {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      draggingPart.cursor = 'nesw-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Bottom left
    if (mouseOnPoint(mouse_nogrid, obj.p3)) {
      draggingPart.part = 3;
      draggingPart.targetPoint = graphs.point(obj.p3.x, obj.p3.y);
      draggingPart.cursor = 'nesw-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Bottom right
    if (mouseOnPoint(mouse_nogrid, obj.p4)) {
      draggingPart.part = 4;
      draggingPart.targetPoint = graphs.point(obj.p4.x, obj.p4.y);
      draggingPart.cursor = 'nwse-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Top
    if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.p1, obj.p2))) {
      draggingPart.part = 5;
      draggingPart.cursor = 'ns-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Right
    if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.p2, obj.p4))) {
      draggingPart.part = 6;
      draggingPart.cursor = 'ew-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Bottom
    if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.p3, obj.p4))) {
      draggingPart.part = 7;
      draggingPart.cursor = 'ns-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Left
    if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.p1, obj.p3))) {
      draggingPart.part = 8;
      draggingPart.cursor = 'ew-resize';
      draggingPart.requiresPBoxUpdate = true;
      return true;
    }
    // Inside
    if ((obj.p1.x < mouse_nogrid.x && mouse_nogrid.x < obj.p2.x) && (obj.p1.y < mouse_nogrid.y && mouse_nogrid.y < obj.p3.y)) {
      draggingPart.part = 0;
      draggingPart.mouse0 = mouse; //開始拖曳時的滑鼠位置 Mouse position when the user starts dragging
      draggingPart.mouse1 = mouse; //拖曳時上一點的滑鼠位置 Mouse position at the last moment during dragging
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //拖曳物件時 When the user is dragging the obj
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    // Top left
    if (draggingPart.part == 1) {
      obj.p1.x = mouse.x;
      obj.p1.y = mouse.y;
      obj.p2.y = mouse.y;
      obj.p3.x = mouse.x;
    }
    // Top right
    else if (draggingPart.part == 2) {
      obj.p2.x = mouse.x;
      obj.p2.y = mouse.y;
      obj.p1.y = mouse.y;
      obj.p4.x = mouse.x;
    }
    // Bottom left
    else if (draggingPart.part == 3) {
      obj.p3.x = mouse.x;
      obj.p3.y = mouse.y;
      obj.p1.x = mouse.x;
      obj.p4.y = mouse.y;
    }
    // Bottom right
    else if (draggingPart.part == 4) {
      obj.p4.x = mouse.x;
      obj.p4.y = mouse.y;
      obj.p2.x = mouse.x;
      obj.p3.y = mouse.y;
    }
    // Top
    else if (draggingPart.part == 5) {
      obj.p1.y = mouse.y;
      obj.p2.y = mouse.y;
    }
    // Right
    else if (draggingPart.part == 6) {
      obj.p2.x = mouse.x;
      obj.p4.x = mouse.x;
    }
    // Bottom
    else if (draggingPart.part == 7) {
      obj.p3.y = mouse.y;
      obj.p4.y = mouse.y;
    }
    // Left
    else if (draggingPart.part == 8) {
      obj.p1.x = mouse.x;
      obj.p3.x = mouse.x;
    }
    // Inside
    else if (draggingPart.part == 0) {
      if (shift)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //放開shift時解除原先之拖曳方向鎖定 Unlock the dragging direction when the user release the shift key
      }
  
      var mouseDiffX = draggingPart.mouse1.x - mouse_snapped.x; //目前滑鼠位置與上一次的滑鼠位置的X軸差 The X difference between the mouse position now and at the previous moment
      var mouseDiffY = draggingPart.mouse1.y - mouse_snapped.y; //目前滑鼠位置與上一次的滑鼠位置的Y軸差 The Y difference between the mouse position now and at the previous moment
      

      obj.p1.x -= mouseDiffX;
      obj.p1.y -= mouseDiffY;
      obj.p2.x -= mouseDiffX;
      obj.p2.y -= mouseDiffY;
      obj.p3.x -= mouseDiffX;
      obj.p3.y -= mouseDiffY;
      obj.p4.x -= mouseDiffX;
      obj.p4.y -= mouseDiffY;

      //更新滑鼠位置 Update the mouse position
      draggingPart.mouse1 = mouse_snapped;
    }

  },

  //將物件畫到Canvas上 Draw the obj on canvas
  draw: function(obj, ctx, aboveLight) {    
    if (!cropMode) return;

    // Draw the crop box
    ctx.strokeStyle = getMouseStyle(obj,'white');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(obj.p1.x, obj.p1.y);
    ctx.lineTo(obj.p2.x, obj.p2.y);
    ctx.lineTo(obj.p4.x, obj.p4.y);
    ctx.lineTo(obj.p3.x, obj.p3.y);
    ctx.lineTo(obj.p1.x, obj.p1.y);
    ctx.stroke();

    // Draw the crop box's corner points
    ctx.fillStyle = getMouseStyle(obj,'white');
    ctx.beginPath();
    ctx.arc(obj.p1.x, obj.p1.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.p2.x, obj.p2.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.p3.x, obj.p3.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(obj.p4.x, obj.p4.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
  }

};