// create database usersDb
var db = openDatabase("usersDb", "1.0", "users database", 65535);

$(document).ready(function() {
  // create table user for first time
  db.transaction(function(ts) {
    ts.executeSql("CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT,fname VARCHAR(32),lname VARCHAR(32))");
  });


  // add data to table
  $(".add-data").click(function() {
    if ($("#fname").val() !== "") {
      db.transaction(function(ts) {
        ts.executeSql("INSERT INTO user(fname,lname) VALUES(?,?)", [$("#fname").val(), $("#lname").val()], function() {
          //  alert("Data inserted");
          location.reload()
        }, function(ts, er) {
          alert(er.message)
        })
      })
    } else {
      $(".u-form").addClass("was-validated");
    }
  });

  // load Data from table
  function loadData() {
    db.transaction(function(ts) {
      ts.executeSql("SELECT * FROM user", undefined, function(ts, result) {
        if (result.rows.length) {

          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $(".data").append(`<tr class="id-${row.id}">
              <td>${i+1}</td>
              <td>${row.fname}</td>
              <td>${row.lname}</td>
              <td class="no-print py-2"><button class="btn btn-success btn-sm" onclick="edit('${row.id}')">Edit</button></td>
              <td class="no-print py-2"><button class="btn btn-danger btn-sm" onclick="del('${row.id}')">Delete</button></td>
              </tr>`)
          }
        } else {
          $(".data").append(`<tr><td colspan="5" class="text-center">Not found</td></tr>`)
        }
      })
    })
  }
  loadData()
});


// Delete data from table
function del(id) {
  if (confirm("Are you sure want to Delete?")) {
    db.transaction(function(ts) {
      ts.executeSql("DELETE FROM user WHERE id="+id, undefined, function(ts) {
        $(".data .id-"+id).fadeOut()
      }, function(er) {
        alert(er.message)
      })
    });
  }
}

// select data for edit from table
function edit(id) {
  db.transaction(function(ts) {
    ts.executeSql("SELECT * FROM user WHERE id="+id, undefined, function(ts,
      res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          var r = res.rows.item(i);
          $("#first_name").val(r.fname);
          $("#last_name").val(r.lname);
          $(".edit-modal .btn-primary").attr("data-id", r.id);
          $(".edit-modal").modal('show')
        }
      }
    })
  })
}


// update selected data
$(".up-btn").click(function() {
  db.transaction(function(ts) {
    ts.executeSql("UPDATE user SET fname=?,lname=? WHERE id=?", [$("#first_name").val(), $("#last_name").val(), $(".up-btn").data('id')], function() {
      $(".edit-modal").modal('hide')
      location.reload();
    }, function(ts, er) {
      alert(er.message)
    })
  })
});

// search
$(".search").keyup(function() {
  var value = $(this).val().toLowerCase();
  $(".data tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
})