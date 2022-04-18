var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET fluffy page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM fluffy",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("fluffy/list", {
          title: "Home",
          data: rows,
          session_store: req.session,
        });
      }
    );
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var fluffy = {
        id: req.params.id,
      };

      var delete_sql = "delete from fluffy where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          fluffy,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/fluffy");
            } else {
              req.flash("msg_info", "Delete Data Success");
              res.redirect("/fluffy");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM fluffy where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/fluffy");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data can't be find!");
              res.redirect("/fluffy");
            } else {
              console.log(rows);
              res.render("fluffy/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_stok = req.sanitize("stok").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_jenis = req.sanitize("jenis").escape();

      var fluffy = {
        nama: v_nama,
        harga: v_harga,
        stok: v_stok,
        jenis: v_jenis,
      };

      var update_sql = "update fluffy SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          fluffy,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("fluffy/edit", {
                nama: req.param("nama"),
                harga: req.param("harga"),
                stok: req.param("stok"),
                jenis: req.param("jenis"),
              });
            } else {
              req.flash("msg_info", "Update data success");
              res.redirect("/fluffy/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/fluffy/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the nama").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_jenis = req.sanitize("jenis").escape();

    var fluffy = {
      nama: v_nama,
      harga: v_harga,
      stok: v_stok,
      jenis: v_jenis,
    };

    var insert_sql = "INSERT INTO fluffy SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        fluffy,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("fluffy/add", {
              nama: req.param("nama"),
              harga: req.param("harga"),
              stok: req.param("stok"),
              jenis: req.param("jenis"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create data success");
            res.redirect("/fluffy");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("fluffy/add", {
      nama: req.param("nama"),
      harga: req.param("harga"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("fluffy/add", {
    title: "Add New Data",
    nama: "",
    stok: "",
    jenis: "",
    harga: "",
    session_store: req.session,
  });
});

module.exports = router;
