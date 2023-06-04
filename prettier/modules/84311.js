var r = require(3832);
require(3068);
require(36607);
require(25063);
require(26953);
require(4742);
require(49563);
require(137);
require(97116);
var i = function (e, t, n, i) {
  var o = r.util.createBuffer();
  var s = e.length >> 1;
  var a = s + (1 & e.length);
  var c = e.substr(0, a);
  var l = e.substr(s, a);
  var u = r.util.createBuffer();
  var p = r.hmac.create();
  n = t + n;
  var d = Math.ceil(i / 16);
  var h = Math.ceil(i / 20);
  p.start("MD5", c);
  var f = r.util.createBuffer();
  u.putBytes(n);
  for (var m = 0; m < d; ++m) {
    p.start(null, null);
    p.update(u.getBytes());
    u.putBuffer(p.digest());
    p.start(null, null);
    p.update(u.bytes() + n);
    f.putBuffer(p.digest());
  }
  p.start("SHA1", l);
  var g = r.util.createBuffer();
  for (u.clear(), u.putBytes(n), m = 0; m < h; ++m) {
    p.start(null, null);
    p.update(u.getBytes());
    u.putBuffer(p.digest());
    p.start(null, null);
    p.update(u.bytes() + n);
    g.putBuffer(p.digest());
  }
  o.putBytes(r.util.xorBytes(f.getBytes(), g.getBytes(), i));
  return o;
};
var o = function (e, t, n) {
  var i = !1;
  try {
    var o = e.deflate(t.fragment.getBytes());
    t.fragment = r.util.createBuffer(o);
    t.length = o.length;
    i = !0;
  } catch (e) {}
  return i;
};
var s = function (e, t, n) {
  var i = !1;
  try {
    var o = e.inflate(t.fragment.getBytes());
    t.fragment = r.util.createBuffer(o);
    t.length = o.length;
    i = !0;
  } catch (e) {}
  return i;
};
var a = function (e, t) {
  var n = 0;
  switch (t) {
    case 1:
      n = e.getByte();
      break;
    case 2:
      n = e.getInt16();
      break;
    case 3:
      n = e.getInt24();
      break;
    case 4:
      n = e.getInt32();
  }
  return r.util.createBuffer(e.getBytes(n));
};
var c = function (e, t, n) {
  e.putInt(n.length(), t << 3);
  e.putBuffer(n);
};
var l = {
  Versions: {
    TLS_1_0: {
      major: 3,
      minor: 1
    },
    TLS_1_1: {
      major: 3,
      minor: 2
    },
    TLS_1_2: {
      major: 3,
      minor: 3
    }
  }
};
l.SupportedVersions = [l.Versions.TLS_1_1, l.Versions.TLS_1_0];
l.Version = l.SupportedVersions[0];
l.MaxFragment = 15360;
l.ConnectionEnd = {
  server: 0,
  client: 1
};
l.PRFAlgorithm = {
  tls_prf_sha256: 0
};
l.BulkCipherAlgorithm = {
  none: null,
  rc4: 0,
  des3: 1,
  aes: 2
};
l.CipherType = {
  stream: 0,
  block: 1,
  aead: 2
};
l.MACAlgorithm = {
  none: null,
  hmac_md5: 0,
  hmac_sha1: 1,
  hmac_sha256: 2,
  hmac_sha384: 3,
  hmac_sha512: 4
};
l.CompressionMethod = {
  none: 0,
  deflate: 1
};
l.ContentType = {
  change_cipher_spec: 20,
  alert: 21,
  handshake: 22,
  application_data: 23,
  heartbeat: 24
};
l.HandshakeType = {
  hello_request: 0,
  client_hello: 1,
  server_hello: 2,
  certificate: 11,
  server_key_exchange: 12,
  certificate_request: 13,
  server_hello_done: 14,
  certificate_verify: 15,
  client_key_exchange: 16,
  finished: 20
};
l.Alert = {};
l.Alert.Level = {
  warning: 1,
  fatal: 2
};
l.Alert.Description = {
  close_notify: 0,
  unexpected_message: 10,
  bad_record_mac: 20,
  decryption_failed: 21,
  record_overflow: 22,
  decompression_failure: 30,
  handshake_failure: 40,
  bad_certificate: 42,
  unsupported_certificate: 43,
  certificate_revoked: 44,
  certificate_expired: 45,
  certificate_unknown: 46,
  illegal_parameter: 47,
  unknown_ca: 48,
  access_denied: 49,
  decode_error: 50,
  decrypt_error: 51,
  export_restriction: 60,
  protocol_version: 70,
  insufficient_security: 71,
  internal_error: 80,
  user_canceled: 90,
  no_renegotiation: 100
};
l.HeartbeatMessageType = {
  heartbeat_request: 1,
  heartbeat_response: 2
};
l.CipherSuites = {};
l.getCipherSuite = function (e) {
  var t = null;
  for (var n in l.CipherSuites) {
    var r = l.CipherSuites[n];
    if (r.id[0] === e.charCodeAt(0) && r.id[1] === e.charCodeAt(1)) {
      t = r;
      break;
    }
  }
  return t;
};
l.handleUnexpected = function (e, t) {
  if (!e.open && e.entity === l.ConnectionEnd.client) {
    e.error(e, {
      message: "Unexpected message. Received TLS record out of order.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.unexpected_message
      }
    });
  }
};
l.handleHelloRequest = function (e, t, n) {
  if (!e.handshaking && e.handshakes > 0) {
    l.queue(e, l.createAlert(e, {
      level: l.Alert.Level.warning,
      description: l.Alert.Description.no_renegotiation
    }));
    l.flush(e);
  }
  e.process();
};
l.parseHelloMessage = function (e, t, n) {
  var i = null;
  var o = e.entity === l.ConnectionEnd.client;
  if (n < 38) e.error(e, {
    message: o ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.illegal_parameter
    }
  });else {
    var s = t.fragment;
    var c = s.length();
    i = {
      version: {
        major: s.getByte(),
        minor: s.getByte()
      },
      random: r.util.createBuffer(s.getBytes(32)),
      session_id: a(s, 1),
      extensions: []
    };
    if (o) {
      i.cipher_suite = s.getBytes(2);
      i.compression_method = s.getByte();
    } else {
      i.cipher_suites = a(s, 2);
      i.compression_methods = a(s, 1);
    }
    if ((c = n - (c - s.length())) > 0) {
      for (var u = a(s, 2); u.length() > 0;) i.extensions.push({
        type: [u.getByte(), u.getByte()],
        data: a(u, 2)
      });
      if (!o) for (var p = 0; p < i.extensions.length; ++p) {
        var d = i.extensions[p];
        if (0 === d.type[0] && 0 === d.type[1]) for (var h = a(d.data, 2); h.length() > 0 && 0 === h.getByte();) e.session.extensions.server_name.serverNameList.push(a(h, 2).getBytes());
      }
    }
    if (e.session.version && (i.version.major !== e.session.version.major || i.version.minor !== e.session.version.minor)) return e.error(e, {
      message: "TLS version change is disallowed during renegotiation.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.protocol_version
      }
    });
    if (o) e.session.cipherSuite = l.getCipherSuite(i.cipher_suite);else for (var f = r.util.createBuffer(i.cipher_suites.bytes()); f.length() > 0 && (e.session.cipherSuite = l.getCipherSuite(f.getBytes(2)), null === e.session.cipherSuite););
    if (null === e.session.cipherSuite) return e.error(e, {
      message: "No cipher suites in common.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.handshake_failure
      },
      cipherSuite: r.util.bytesToHex(i.cipher_suite)
    });
    e.session.compressionMethod = o ? i.compression_method : l.CompressionMethod.none;
  }
  return i;
};
l.createSecurityParameters = function (e, t) {
  var n = e.entity === l.ConnectionEnd.client;
  var r = t.random.bytes();
  var i = n ? e.session.sp.client_random : r;
  var o = n ? r : l.createRandom().getBytes();
  e.session.sp = {
    entity: e.entity,
    prf_algorithm: l.PRFAlgorithm.tls_prf_sha256,
    bulk_cipher_algorithm: null,
    cipher_type: null,
    enc_key_length: null,
    block_length: null,
    fixed_iv_length: null,
    record_iv_length: null,
    mac_algorithm: null,
    mac_length: null,
    mac_key_length: null,
    compression_algorithm: e.session.compressionMethod,
    pre_master_secret: null,
    master_secret: null,
    client_random: i,
    server_random: o
  };
};
l.handleServerHello = function (e, t, n) {
  var r = l.parseHelloMessage(e, t, n);
  if (!e.fail) {
    if (!(r.version.minor <= e.version.minor)) return e.error(e, {
      message: "Incompatible TLS version.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.protocol_version
      }
    });
    e.version.minor = r.version.minor;
    e.session.version = e.version;
    var i = r.session_id.bytes();
    if (i.length > 0 && i === e.session.id) {
      e.expect = f;
      e.session.resuming = !0;
      e.session.sp.server_random = r.random.bytes();
    } else {
      e.expect = u;
      e.session.resuming = !1;
      l.createSecurityParameters(e, r);
    }
    e.session.id = i;
    e.process();
  }
};
l.handleClientHello = function (e, t, n) {
  var i = l.parseHelloMessage(e, t, n);
  if (!e.fail) {
    var o = i.session_id.bytes();
    var s = null;
    if (e.sessionCache) {
      if (null === (s = e.sessionCache.getSession(o))) {
        o = "";
      } else {
        if (s.version.major !== i.version.major || s.version.minor > i.version.minor) {
          s = null;
          o = "";
        }
      }
    }
    if (0 === o.length) {
      o = r.random.getBytes(32);
    }
    e.session.id = o;
    e.session.clientHelloVersion = i.version;
    e.session.sp = {};
    if (s) e.version = e.session.version = s.version, e.session.sp = s.sp;else {
      for (var a, c = 1; c < l.SupportedVersions.length && !((a = l.SupportedVersions[c]).minor <= i.version.minor); ++c);
      e.version = {
        major: a.major,
        minor: a.minor
      }, e.session.version = e.version;
    }
    if (null !== s) {
      e.expect = E;
      e.session.resuming = !0;
      e.session.sp.client_random = i.random.bytes();
    } else {
      e.expect = !1 !== e.verifyClient ? _ : v;
      e.session.resuming = !1;
      l.createSecurityParameters(e, i);
    }
    e.open = !0;
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.handshake,
      data: l.createServerHello(e)
    }));
    if (e.session.resuming) {
      l.queue(e, l.createRecord(e, {
        type: l.ContentType.change_cipher_spec,
        data: l.createChangeCipherSpec()
      }));
      e.state.pending = l.createConnectionState(e);
      e.state.current.write = e.state.pending.write;
      l.queue(e, l.createRecord(e, {
        type: l.ContentType.handshake,
        data: l.createFinished(e)
      }));
    } else {
      l.queue(e, l.createRecord(e, {
        type: l.ContentType.handshake,
        data: l.createCertificate(e)
      }));
      if (e.fail) {
        l.queue(e, l.createRecord(e, {
          type: l.ContentType.handshake,
          data: l.createServerKeyExchange(e)
        }));
        if (!1 !== e.verifyClient) {
          l.queue(e, l.createRecord(e, {
            type: l.ContentType.handshake,
            data: l.createCertificateRequest(e)
          }));
        }
        l.queue(e, l.createRecord(e, {
          type: l.ContentType.handshake,
          data: l.createServerHelloDone(e)
        }));
      }
    }
    l.flush(e);
    e.process();
  }
};
l.handleCertificate = function (e, t, n) {
  if (n < 3) return e.error(e, {
    message: "Invalid Certificate message. Message too short.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.illegal_parameter
    }
  });
  var i;
  var o;
  var s = t.fragment;
  var c = {
    certificate_list: a(s, 3)
  };
  var u = [];
  try {
    for (; c.certificate_list.length() > 0;) {
      i = a(c.certificate_list, 3);
      o = r.asn1.fromDer(i);
      i = r.pki.certificateFromAsn1(o, !0);
      u.push(i);
    }
  } catch (t) {
    return e.error(e, {
      message: "Could not parse certificate list.",
      cause: t,
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.bad_certificate
      }
    });
  }
  var d = e.entity === l.ConnectionEnd.client;
  if (!d && !0 !== e.verifyClient || 0 !== u.length) {
    if (0 === u.length) {
      e.expect = d ? p : v;
    } else {
      if (d) {
        e.session.serverCertificate = u[0];
      } else {
        e.session.clientCertificate = u[0];
      }
      if (l.verifyCertificateChain(e, u)) {
        e.expect = d ? p : v;
      }
    }
  } else {
    e.error(e, {
      message: d ? "No server certificate provided." : "No client certificate provided.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.illegal_parameter
      }
    });
  }
  e.process();
};
l.handleServerKeyExchange = function (e, t, n) {
  if (n > 0) return e.error(e, {
    message: "Invalid key parameters. Only RSA is supported.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.unsupported_certificate
    }
  });
  e.expect = d;
  e.process();
};
l.handleClientKeyExchange = function (e, t, n) {
  if (n < 48) return e.error(e, {
    message: "Invalid key parameters. Only RSA is supported.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.unsupported_certificate
    }
  });
  var i = t.fragment;
  var o = {
    enc_pre_master_secret: a(i, 2).getBytes()
  };
  var s = null;
  if (e.getPrivateKey) try {
    s = e.getPrivateKey(e, e.session.serverCertificate);
    s = r.pki.privateKeyFromPem(s);
  } catch (t) {
    e.error(e, {
      message: "Could not get private key.",
      cause: t,
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.internal_error
      }
    });
  }
  if (null === s) return e.error(e, {
    message: "No private key set.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.internal_error
    }
  });
  try {
    var c = e.session.sp;
    c.pre_master_secret = s.decrypt(o.enc_pre_master_secret);
    var u = e.session.clientHelloVersion;
    if (u.major !== c.pre_master_secret.charCodeAt(0) || u.minor !== c.pre_master_secret.charCodeAt(1)) throw new Error("TLS version rollback attack detected.");
  } catch (e) {
    c.pre_master_secret = r.random.getBytes(48);
  }
  e.expect = E;
  if (null !== e.session.clientCertificate) {
    e.expect = b;
  }
  e.process();
};
l.handleCertificateRequest = function (e, t, n) {
  if (n < 3) return e.error(e, {
    message: "Invalid CertificateRequest. Message too short.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.illegal_parameter
    }
  });
  var r = t.fragment;
  var i = {
    certificate_types: a(r, 1),
    certificate_authorities: a(r, 2)
  };
  e.session.certificateRequest = i;
  e.expect = h;
  e.process();
};
l.handleCertificateVerify = function (e, t, n) {
  if (n < 2) return e.error(e, {
    message: "Invalid CertificateVerify. Message too short.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.illegal_parameter
    }
  });
  var i = t.fragment;
  i.read -= 4;
  var o = i.bytes();
  i.read += 4;
  var s = {
    signature: a(i, 2).getBytes()
  };
  var c = r.util.createBuffer();
  c.putBuffer(e.session.md5.digest());
  c.putBuffer(e.session.sha1.digest());
  c = c.getBytes();
  try {
    if (!e.session.clientCertificate.publicKey.verify(c, s.signature, "NONE")) throw new Error("CertificateVerify signature does not match.");
    e.session.md5.update(o);
    e.session.sha1.update(o);
  } catch (t) {
    return e.error(e, {
      message: "Bad signature in CertificateVerify.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.handshake_failure
      }
    });
  }
  e.expect = E;
  e.process();
};
l.handleServerHelloDone = function (e, t, n) {
  if (n > 0) return e.error(e, {
    message: "Invalid ServerHelloDone message. Invalid length.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.record_overflow
    }
  });
  if (null === e.serverCertificate) {
    var i = {
      message: "No server certificate provided. Not enough security.",
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.insufficient_security
      }
    };
    var o = e.verify(e, i.alert.description, 0, []);
    if (!0 !== o) {
      if (o || 0 === o) {
        if ("object" != typeof o || r.util.isArray(o)) {
          if ("number" == typeof o) {
            i.alert.description = o;
          }
        } else {
          if (o.message) {
            i.message = o.message;
          }
          if (o.alert) {
            i.alert.description = o.alert;
          }
        }
      }
      return e.error(e, i);
    }
  }
  if (null !== e.session.certificateRequest) {
    t = l.createRecord(e, {
      type: l.ContentType.handshake,
      data: l.createCertificate(e)
    });
    l.queue(e, t);
  }
  t = l.createRecord(e, {
    type: l.ContentType.handshake,
    data: l.createClientKeyExchange(e)
  });
  l.queue(e, t);
  e.expect = y;
  var s = function (e, t) {
    if (null !== e.session.certificateRequest && null !== e.session.clientCertificate) {
      l.queue(e, l.createRecord(e, {
        type: l.ContentType.handshake,
        data: l.createCertificateVerify(e, t)
      }));
    }
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.change_cipher_spec,
      data: l.createChangeCipherSpec()
    }));
    e.state.pending = l.createConnectionState(e);
    e.state.current.write = e.state.pending.write;
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.handshake,
      data: l.createFinished(e)
    }));
    e.expect = f;
    l.flush(e);
    e.process();
  };
  if (null === e.session.certificateRequest || null === e.session.clientCertificate) return s(e, null);
  l.getClientSignature(e, s);
};
l.handleChangeCipherSpec = function (e, t) {
  if (1 !== t.fragment.getByte()) return e.error(e, {
    message: "Invalid ChangeCipherSpec message received.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.illegal_parameter
    }
  });
  var n = e.entity === l.ConnectionEnd.client;
  if (e.session.resuming && n || !e.session.resuming && !n) {
    e.state.pending = l.createConnectionState(e);
  }
  e.state.current.read = e.state.pending.read;
  if (!e.session.resuming && n || e.session.resuming && !n) {
    e.state.pending = null;
  }
  e.expect = n ? m : w;
  e.process();
};
l.handleFinished = function (e, t, n) {
  var o = t.fragment;
  o.read -= 4;
  var s = o.bytes();
  o.read += 4;
  var a = t.fragment.getBytes();
  (o = r.util.createBuffer()).putBuffer(e.session.md5.digest());
  o.putBuffer(e.session.sha1.digest());
  var c = e.entity === l.ConnectionEnd.client;
  var u = c ? "server finished" : "client finished";
  var p = e.session.sp;
  if ((o = i(p.master_secret, u, o.getBytes(), 12)).getBytes() !== a) return e.error(e, {
    message: "Invalid verify_data in Finished message.",
    send: !0,
    alert: {
      level: l.Alert.Level.fatal,
      description: l.Alert.Description.decrypt_error
    }
  });
  e.session.md5.update(s);
  e.session.sha1.update(s);
  if (e.session.resuming && c || !e.session.resuming && !c) {
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.change_cipher_spec,
      data: l.createChangeCipherSpec()
    }));
    e.state.current.write = e.state.pending.write;
    e.state.pending = null;
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.handshake,
      data: l.createFinished(e)
    }));
  }
  e.expect = c ? g : T;
  e.handshaking = !1;
  ++e.handshakes;
  e.peerCertificate = c ? e.session.serverCertificate : e.session.clientCertificate;
  l.flush(e);
  e.isConnected = !0;
  e.connected(e);
  e.process();
};
l.handleAlert = function (e, t) {
  var n;
  var r = t.fragment;
  var i = {
    level: r.getByte(),
    description: r.getByte()
  };
  switch (i.description) {
    case l.Alert.Description.close_notify:
      n = "Connection closed.";
      break;
    case l.Alert.Description.unexpected_message:
      n = "Unexpected message.";
      break;
    case l.Alert.Description.bad_record_mac:
      n = "Bad record MAC.";
      break;
    case l.Alert.Description.decryption_failed:
      n = "Decryption failed.";
      break;
    case l.Alert.Description.record_overflow:
      n = "Record overflow.";
      break;
    case l.Alert.Description.decompression_failure:
      n = "Decompression failed.";
      break;
    case l.Alert.Description.handshake_failure:
      n = "Handshake failure.";
      break;
    case l.Alert.Description.bad_certificate:
      n = "Bad certificate.";
      break;
    case l.Alert.Description.unsupported_certificate:
      n = "Unsupported certificate.";
      break;
    case l.Alert.Description.certificate_revoked:
      n = "Certificate revoked.";
      break;
    case l.Alert.Description.certificate_expired:
      n = "Certificate expired.";
      break;
    case l.Alert.Description.certificate_unknown:
      n = "Certificate unknown.";
      break;
    case l.Alert.Description.illegal_parameter:
      n = "Illegal parameter.";
      break;
    case l.Alert.Description.unknown_ca:
      n = "Unknown certificate authority.";
      break;
    case l.Alert.Description.access_denied:
      n = "Access denied.";
      break;
    case l.Alert.Description.decode_error:
      n = "Decode error.";
      break;
    case l.Alert.Description.decrypt_error:
      n = "Decrypt error.";
      break;
    case l.Alert.Description.export_restriction:
      n = "Export restriction.";
      break;
    case l.Alert.Description.protocol_version:
      n = "Unsupported protocol version.";
      break;
    case l.Alert.Description.insufficient_security:
      n = "Insufficient security.";
      break;
    case l.Alert.Description.internal_error:
      n = "Internal error.";
      break;
    case l.Alert.Description.user_canceled:
      n = "User canceled.";
      break;
    case l.Alert.Description.no_renegotiation:
      n = "Renegotiation not supported.";
      break;
    default:
      n = "Unknown error.";
  }
  if (i.description === l.Alert.Description.close_notify) return e.close();
  e.error(e, {
    message: n,
    send: !1,
    origin: e.entity === l.ConnectionEnd.client ? "server" : "client",
    alert: i
  });
  e.process();
};
l.handleHandshake = function (e, t) {
  var n = t.fragment;
  var i = n.getByte();
  var o = n.getInt24();
  if (o > n.length()) {
    e.fragmented = t;
    t.fragment = r.util.createBuffer();
    n.read -= 4;
    return e.process();
  }
  e.fragmented = null;
  n.read -= 4;
  var s = n.bytes(o + 4);
  n.read += 4;
  if (i in F[e.entity][e.expect]) {
    if (e.entity !== l.ConnectionEnd.server || e.open || e.fail) {
      e.handshaking = !0;
      e.session = {
        version: null,
        extensions: {
          server_name: {
            serverNameList: []
          }
        },
        cipherSuite: null,
        compressionMethod: null,
        serverCertificate: null,
        clientCertificate: null,
        md5: r.md.md5.create(),
        sha1: r.md.sha1.create()
      };
    }
    if (i !== l.HandshakeType.hello_request && i !== l.HandshakeType.certificate_verify && i !== l.HandshakeType.finished) {
      e.session.md5.update(s);
      e.session.sha1.update(s);
    }
    F[e.entity][e.expect][i](e, t, o);
  } else {
    l.handleUnexpected(e, t);
  }
};
l.handleApplicationData = function (e, t) {
  e.data.putBuffer(t.fragment);
  e.dataReady(e);
  e.process();
};
l.handleHeartbeat = function (e, t) {
  var n = t.fragment;
  var i = n.getByte();
  var o = n.getInt16();
  var s = n.getBytes(o);
  if (i === l.HeartbeatMessageType.heartbeat_request) {
    if (e.handshaking || o > s.length) return e.process();
    l.queue(e, l.createRecord(e, {
      type: l.ContentType.heartbeat,
      data: l.createHeartbeat(l.HeartbeatMessageType.heartbeat_response, s)
    }));
    l.flush(e);
  } else if (i === l.HeartbeatMessageType.heartbeat_response) {
    if (s !== e.expectedHeartbeatPayload) return e.process();
    if (e.heartbeatReceived) {
      e.heartbeatReceived(e, r.util.createBuffer(s));
    }
  }
  e.process();
};
var u = 1;
var p = 2;
var d = 3;
var h = 4;
var f = 5;
var m = 6;
var g = 7;
var y = 8;
var _ = 1;
var v = 2;
var b = 3;
var E = 4;
var w = 5;
var T = 6;
var S = l.handleUnexpected;
var x = l.handleChangeCipherSpec;
var C = l.handleAlert;
var I = l.handleHandshake;
var A = l.handleApplicationData;
var k = l.handleHeartbeat;
var P = [];
P[l.ConnectionEnd.client] = [[S, C, I, S, k], [S, C, I, S, k], [S, C, I, S, k], [S, C, I, S, k], [S, C, I, S, k], [x, C, S, S, k], [S, C, I, S, k], [S, C, I, A, k], [S, C, I, S, k]];
P[l.ConnectionEnd.server] = [[S, C, I, S, k], [S, C, I, S, k], [S, C, I, S, k], [S, C, I, S, k], [x, C, S, S, k], [S, C, I, S, k], [S, C, I, A, k], [S, C, I, S, k]];
var N = l.handleHelloRequest;
var O = l.handleServerHello;
var R = l.handleCertificate;
var M = l.handleServerKeyExchange;
var L = l.handleCertificateRequest;
var D = l.handleServerHelloDone;
var B = l.handleFinished;
var F = [];
F[l.ConnectionEnd.client] = [[S, S, O, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, R, M, L, D, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, M, L, D, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, S, L, D, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, S, S, D, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, B], [N, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [N, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S]];
var j = l.handleClientHello;
var U = l.handleClientKeyExchange;
var $ = l.handleCertificateVerify;
F[l.ConnectionEnd.server] = [[S, j, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, R, S, S, S, S, S, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, U, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, $, S, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, B], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S], [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S]];
l.generateKeys = function (e, t) {
  var n = i;
  var r = t.client_random + t.server_random;
  if (e.session.resuming) {
    t.master_secret = n(t.pre_master_secret, "master secret", r, 48).bytes();
    t.pre_master_secret = null;
  }
  r = t.server_random + t.client_random;
  var o = 2 * t.mac_key_length + 2 * t.enc_key_length;
  var s = e.version.major === l.Versions.TLS_1_0.major && e.version.minor === l.Versions.TLS_1_0.minor;
  if (s) {
    o += 2 * t.fixed_iv_length;
  }
  var a = n(t.master_secret, "key expansion", r, o);
  var c = {
    client_write_MAC_key: a.getBytes(t.mac_key_length),
    server_write_MAC_key: a.getBytes(t.mac_key_length),
    client_write_key: a.getBytes(t.enc_key_length),
    server_write_key: a.getBytes(t.enc_key_length)
  };
  if (s) {
    c.client_write_IV = a.getBytes(t.fixed_iv_length);
    c.server_write_IV = a.getBytes(t.fixed_iv_length);
  }
  return c;
};
l.createConnectionState = function (e) {
  var t = e.entity === l.ConnectionEnd.client;
  var n = function () {
    var e = {
      sequenceNumber: [0, 0],
      macKey: null,
      macLength: 0,
      macFunction: null,
      cipherState: null,
      cipherFunction: function (e) {
        return !0;
      },
      compressionState: null,
      compressFunction: function (e) {
        return !0;
      },
      updateSequenceNumber: function () {
        if (4294967295 === e.sequenceNumber[1]) {
          e.sequenceNumber[1] = 0;
          ++e.sequenceNumber[0];
        } else {
          ++e.sequenceNumber[1];
        }
      }
    };
    return e;
  };
  var r = {
    read: n(),
    write: n()
  };
  r.read.update = function (e, t) {
    if (r.read.cipherFunction(t, r.read)) {
      if (r.read.compressFunction(e, t, r.read)) {
        e.error(e, {
          message: "Could not decompress record.",
          send: !0,
          alert: {
            level: l.Alert.Level.fatal,
            description: l.Alert.Description.decompression_failure
          }
        });
      }
    } else {
      e.error(e, {
        message: "Could not decrypt record or bad MAC.",
        send: !0,
        alert: {
          level: l.Alert.Level.fatal,
          description: l.Alert.Description.bad_record_mac
        }
      });
    }
    return !e.fail;
  };
  r.write.update = function (e, t) {
    if (r.write.compressFunction(e, t, r.write)) {
      if (r.write.cipherFunction(t, r.write)) {
        e.error(e, {
          message: "Could not encrypt record.",
          send: !1,
          alert: {
            level: l.Alert.Level.fatal,
            description: l.Alert.Description.internal_error
          }
        });
      }
    } else {
      e.error(e, {
        message: "Could not compress record.",
        send: !1,
        alert: {
          level: l.Alert.Level.fatal,
          description: l.Alert.Description.internal_error
        }
      });
    }
    return !e.fail;
  };
  if (e.session) {
    var i = e.session.sp;
    switch (e.session.cipherSuite.initSecurityParameters(i), i.keys = l.generateKeys(e, i), r.read.macKey = t ? i.keys.server_write_MAC_key : i.keys.client_write_MAC_key, r.write.macKey = t ? i.keys.client_write_MAC_key : i.keys.server_write_MAC_key, e.session.cipherSuite.initConnectionState(r, e, i), i.compression_algorithm) {
      case l.CompressionMethod.none:
        break;
      case l.CompressionMethod.deflate:
        r.read.compressFunction = s, r.write.compressFunction = o;
        break;
      default:
        throw new Error("Unsupported compression algorithm.");
    }
  }
  return r;
};
l.createRandom = function () {
  var e = new Date();
  var t = +e + 6e4 * e.getTimezoneOffset();
  var n = r.util.createBuffer();
  n.putInt32(t);
  n.putBytes(r.random.getBytes(28));
  return n;
};
l.createRecord = function (e, t) {
  return t.data ? {
    type: t.type,
    version: {
      major: e.version.major,
      minor: e.version.minor
    },
    length: t.data.length(),
    fragment: t.data
  } : null;
};
l.createAlert = function (e, t) {
  var n = r.util.createBuffer();
  n.putByte(t.level);
  n.putByte(t.description);
  return l.createRecord(e, {
    type: l.ContentType.alert,
    data: n
  });
};
l.createClientHello = function (e) {
  e.session.clientHelloVersion = {
    major: e.version.major,
    minor: e.version.minor
  };
  for (t = r.util.createBuffer(), n = 0, void 0; n < e.cipherSuites.length; ++n) {
    var t;
    var n;
    var i = e.cipherSuites[n];
    t.putByte(i.id[0]);
    t.putByte(i.id[1]);
  }
  var o = t.length();
  var s = r.util.createBuffer();
  s.putByte(l.CompressionMethod.none);
  var a = s.length();
  var u = r.util.createBuffer();
  if (e.virtualHost) {
    var p = r.util.createBuffer();
    p.putByte(0);
    p.putByte(0);
    var d = r.util.createBuffer();
    d.putByte(0);
    c(d, 2, r.util.createBuffer(e.virtualHost));
    var h = r.util.createBuffer();
    c(h, 2, d);
    c(p, 2, h);
    u.putBuffer(p);
  }
  var f = u.length();
  if (f > 0) {
    f += 2;
  }
  var m = e.session.id;
  var g = m.length + 1 + 2 + 4 + 28 + 2 + o + 1 + a + f;
  var y = r.util.createBuffer();
  y.putByte(l.HandshakeType.client_hello);
  y.putInt24(g);
  y.putByte(e.version.major);
  y.putByte(e.version.minor);
  y.putBytes(e.session.sp.client_random);
  c(y, 1, r.util.createBuffer(m));
  c(y, 2, t);
  c(y, 1, s);
  if (f > 0) {
    c(y, 2, u);
  }
  return y;
};
l.createServerHello = function (e) {
  var t = e.session.id;
  var n = t.length + 1 + 2 + 4 + 28 + 2 + 1;
  var i = r.util.createBuffer();
  i.putByte(l.HandshakeType.server_hello);
  i.putInt24(n);
  i.putByte(e.version.major);
  i.putByte(e.version.minor);
  i.putBytes(e.session.sp.server_random);
  c(i, 1, r.util.createBuffer(t));
  i.putByte(e.session.cipherSuite.id[0]);
  i.putByte(e.session.cipherSuite.id[1]);
  i.putByte(e.session.compressionMethod);
  return i;
};
l.createCertificate = function (e) {
  var t;
  var n = e.entity === l.ConnectionEnd.client;
  var i = null;
  if (e.getCertificate) {
    t = n ? e.session.certificateRequest : e.session.extensions.server_name.serverNameList;
    i = e.getCertificate(e, t);
  }
  var o = r.util.createBuffer();
  if (null !== i) try {
    if (r.util.isArray(i)) {
      i = [i];
    }
    for (s = null, a = 0, void 0; a < i.length; ++a) {
      var s;
      var a;
      var u = r.pem.decode(i[a])[0];
      if ("CERTIFICATE" !== u.type && "X509 CERTIFICATE" !== u.type && "TRUSTED CERTIFICATE" !== u.type) {
        var p = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
        throw p.headerType = u.type, p;
      }
      if (u.procType && "ENCRYPTED" === u.procType.type) throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
      var d = r.util.createBuffer(u.body);
      if (null === s) {
        s = r.asn1.fromDer(d.bytes(), !1);
      }
      var h = r.util.createBuffer();
      c(h, 3, d);
      o.putBuffer(h);
    }
    i = r.pki.certificateFromAsn1(s);
    if (n) {
      e.session.clientCertificate = i;
    } else {
      e.session.serverCertificate = i;
    }
  } catch (t) {
    return e.error(e, {
      message: "Could not send certificate list.",
      cause: t,
      send: !0,
      alert: {
        level: l.Alert.Level.fatal,
        description: l.Alert.Description.bad_certificate
      }
    });
  }
  var f = 3 + o.length();
  var m = r.util.createBuffer();
  m.putByte(l.HandshakeType.certificate);
  m.putInt24(f);
  c(m, 3, o);
  return m;
};
l.createClientKeyExchange = function (e) {
  var t = r.util.createBuffer();
  t.putByte(e.session.clientHelloVersion.major);
  t.putByte(e.session.clientHelloVersion.minor);
  t.putBytes(r.random.getBytes(46));
  var n = e.session.sp;
  n.pre_master_secret = t.getBytes();
  var i = (t = e.session.serverCertificate.publicKey.encrypt(n.pre_master_secret)).length + 2;
  var o = r.util.createBuffer();
  o.putByte(l.HandshakeType.client_key_exchange);
  o.putInt24(i);
  o.putInt16(t.length);
  o.putBytes(t);
  return o;
};
l.createServerKeyExchange = function (e) {
  return r.util.createBuffer();
};
l.getClientSignature = function (e, t) {
  var n = r.util.createBuffer();
  n.putBuffer(e.session.md5.digest());
  n.putBuffer(e.session.sha1.digest());
  n = n.getBytes();
  e.getSignature = e.getSignature || function (e, t, n) {
    var i = null;
    if (e.getPrivateKey) try {
      i = e.getPrivateKey(e, e.session.clientCertificate);
      i = r.pki.privateKeyFromPem(i);
    } catch (t) {
      e.error(e, {
        message: "Could not get private key.",
        cause: t,
        send: !0,
        alert: {
          level: l.Alert.Level.fatal,
          description: l.Alert.Description.internal_error
        }
      });
    }
    if (null === i) {
      e.error(e, {
        message: "No private key set.",
        send: !0,
        alert: {
          level: l.Alert.Level.fatal,
          description: l.Alert.Description.internal_error
        }
      });
    } else {
      t = i.sign(t, null);
    }
    n(e, t);
  };
  e.getSignature(e, n, t);
};
l.createCertificateVerify = function (e, t) {
  var n = t.length + 2;
  var i = r.util.createBuffer();
  i.putByte(l.HandshakeType.certificate_verify);
  i.putInt24(n);
  i.putInt16(t.length);
  i.putBytes(t);
  return i;
};
l.createCertificateRequest = function (e) {
  var t = r.util.createBuffer();
  t.putByte(1);
  var n = r.util.createBuffer();
  for (var i in e.caStore.certs) {
    var o = e.caStore.certs[i];
    var s = r.pki.distinguishedNameToAsn1(o.subject);
    var a = r.asn1.toDer(s);
    n.putInt16(a.length());
    n.putBuffer(a);
  }
  var u = 1 + t.length() + 2 + n.length();
  var p = r.util.createBuffer();
  p.putByte(l.HandshakeType.certificate_request);
  p.putInt24(u);
  c(p, 1, t);
  c(p, 2, n);
  return p;
};
l.createServerHelloDone = function (e) {
  var t = r.util.createBuffer();
  t.putByte(l.HandshakeType.server_hello_done);
  t.putInt24(0);
  return t;
};
l.createChangeCipherSpec = function () {
  var e = r.util.createBuffer();
  e.putByte(1);
  return e;
};
l.createFinished = function (e) {
  var t = r.util.createBuffer();
  t.putBuffer(e.session.md5.digest());
  t.putBuffer(e.session.sha1.digest());
  var n = e.entity === l.ConnectionEnd.client;
  var o = e.session.sp;
  var s = n ? "client finished" : "server finished";
  t = i(o.master_secret, s, t.getBytes(), 12);
  var a = r.util.createBuffer();
  a.putByte(l.HandshakeType.finished);
  a.putInt24(t.length());
  a.putBuffer(t);
  return a;
};
l.createHeartbeat = function (e, t, n) {
  if (void 0 === n) {
    n = t.length;
  }
  var i = r.util.createBuffer();
  i.putByte(e);
  i.putInt16(n);
  i.putBytes(t);
  var o = i.length();
  var s = Math.max(16, o - n - 3);
  i.putBytes(r.random.getBytes(s));
  return i;
};
l.queue = function (e, t) {
  if (t && (0 !== t.fragment.length() || t.type !== l.ContentType.handshake && t.type !== l.ContentType.alert && t.type !== l.ContentType.change_cipher_spec)) {
    if (t.type === l.ContentType.handshake) {
      var n = t.fragment.bytes();
      e.session.md5.update(n);
      e.session.sha1.update(n);
      n = null;
    }
    var i;
    if (t.fragment.length() <= l.MaxFragment) i = [t];else {
      i = [];
      for (var o = t.fragment.bytes(); o.length > l.MaxFragment;) {
        i.push(l.createRecord(e, {
          type: t.type,
          data: r.util.createBuffer(o.slice(0, l.MaxFragment))
        }));
        o = o.slice(l.MaxFragment);
      }
      if (o.length > 0) {
        i.push(l.createRecord(e, {
          type: t.type,
          data: r.util.createBuffer(o)
        }));
      }
    }
    for (var s = 0; s < i.length && !e.fail; ++s) {
      var a = i[s];
      if (e.state.current.write.update(e, a)) {
        e.records.push(a);
      }
    }
  }
};
l.flush = function (e) {
  for (var t = 0; t < e.records.length; ++t) {
    var n = e.records[t];
    e.tlsData.putByte(n.type);
    e.tlsData.putByte(n.version.major);
    e.tlsData.putByte(n.version.minor);
    e.tlsData.putInt16(n.fragment.length());
    e.tlsData.putBuffer(e.records[t].fragment);
  }
  e.records = [];
  return e.tlsDataReady(e);
};
var V = function (e) {
  switch (e) {
    case !0:
      return !0;
    case r.pki.certificateError.bad_certificate:
      return l.Alert.Description.bad_certificate;
    case r.pki.certificateError.unsupported_certificate:
      return l.Alert.Description.unsupported_certificate;
    case r.pki.certificateError.certificate_revoked:
      return l.Alert.Description.certificate_revoked;
    case r.pki.certificateError.certificate_expired:
      return l.Alert.Description.certificate_expired;
    case r.pki.certificateError.certificate_unknown:
      return l.Alert.Description.certificate_unknown;
    case r.pki.certificateError.unknown_ca:
      return l.Alert.Description.unknown_ca;
    default:
      return l.Alert.Description.bad_certificate;
  }
};
for (var H in l.verifyCertificateChain = function (e, t) {
  try {
    var n = {};
    for (var i in e.verifyOptions) n[i] = e.verifyOptions[i];
    n.verify = function (t, n, i) {
      V(t);
      var o = e.verify(e, t, n, i);
      if (!0 !== o) {
        if ("object" == typeof o && !r.util.isArray(o)) {
          var s = new Error("The application rejected the certificate.");
          throw s.send = !0, s.alert = {
            level: l.Alert.Level.fatal,
            description: l.Alert.Description.bad_certificate
          }, o.message && (s.message = o.message), o.alert && (s.alert.description = o.alert), s;
        }
        if (o !== t) {
          o = function (e) {
            switch (e) {
              case !0:
                return !0;
              case l.Alert.Description.bad_certificate:
                return r.pki.certificateError.bad_certificate;
              case l.Alert.Description.unsupported_certificate:
                return r.pki.certificateError.unsupported_certificate;
              case l.Alert.Description.certificate_revoked:
                return r.pki.certificateError.certificate_revoked;
              case l.Alert.Description.certificate_expired:
                return r.pki.certificateError.certificate_expired;
              case l.Alert.Description.certificate_unknown:
                return r.pki.certificateError.certificate_unknown;
              case l.Alert.Description.unknown_ca:
                return r.pki.certificateError.unknown_ca;
              default:
                return r.pki.certificateError.bad_certificate;
            }
          }(o);
        }
      }
      return o;
    };
    r.pki.verifyCertificateChain(e.caStore, t, n);
  } catch (t) {
    var o = t;
    if ("object" != typeof o || r.util.isArray(o)) {
      o = {
        send: !0,
        alert: {
          level: l.Alert.Level.fatal,
          description: V(t)
        }
      };
    }
    if ("send" in o) {
      o.send = !0;
    }
    if ("alert" in o) {
      o.alert = {
        level: l.Alert.Level.fatal,
        description: V(o.error)
      };
    }
    e.error(e, o);
  }
  return !e.fail;
}, l.createSessionCache = function (e, t) {
  var n = null;
  if (e && e.getSession && e.setSession && e.order) n = e;else {
    for (var i in (n = {}).cache = e || {}, n.capacity = Math.max(t || 100, 1), n.order = [], e) if (n.order.length <= t) {
      n.order.push(i);
    } else {
      delete e[i];
    }
    n.getSession = function (e) {
      var t = null;
      var i = null;
      if (e) {
        i = r.util.bytesToHex(e);
      } else {
        if (n.order.length > 0) {
          i = n.order[0];
        }
      }
      if (null !== i && i in n.cache) for (var o in t = n.cache[i], delete n.cache[i], n.order) if (n.order[o] === i) {
        n.order.splice(o, 1);
        break;
      }
      return t;
    };
    n.setSession = function (e, t) {
      if (n.order.length === n.capacity) {
        var i = n.order.shift();
        delete n.cache[i];
      }
      i = r.util.bytesToHex(e);
      n.order.push(i);
      n.cache[i] = t;
    };
  }
  return n;
}, l.createConnection = function (e) {
  var t;
  t = e.caStore ? r.util.isArray(e.caStore) ? r.pki.createCaStore(e.caStore) : e.caStore : r.pki.createCaStore();
  var n = e.cipherSuites || null;
  if (null === n) for (var i in n = [], l.CipherSuites) n.push(l.CipherSuites[i]);
  var o = e.server ? l.ConnectionEnd.server : l.ConnectionEnd.client;
  var s = e.sessionCache ? l.createSessionCache(e.sessionCache) : null;
  var a = {
    version: {
      major: l.Version.major,
      minor: l.Version.minor
    },
    entity: o,
    sessionId: e.sessionId,
    caStore: t,
    sessionCache: s,
    cipherSuites: n,
    connected: e.connected,
    virtualHost: e.virtualHost || null,
    verifyClient: e.verifyClient || !1,
    verify: e.verify || function (e, t, n, r) {
      return t;
    },
    verifyOptions: e.verifyOptions || {},
    getCertificate: e.getCertificate || null,
    getPrivateKey: e.getPrivateKey || null,
    getSignature: e.getSignature || null,
    input: r.util.createBuffer(),
    tlsData: r.util.createBuffer(),
    data: r.util.createBuffer(),
    tlsDataReady: e.tlsDataReady,
    dataReady: e.dataReady,
    heartbeatReceived: e.heartbeatReceived,
    closed: e.closed,
    error: function (t, n) {
      n.origin = n.origin || (t.entity === l.ConnectionEnd.client ? "client" : "server");
      if (n.send) {
        l.queue(t, l.createAlert(t, n.alert));
        l.flush(t);
      }
      var r = !1 !== n.fatal;
      if (r) {
        t.fail = !0;
      }
      e.error(t, n);
      if (r) {
        t.close(!1);
      }
    },
    deflate: e.deflate || null,
    inflate: e.inflate || null,
    reset: function (e) {
      a.version = {
        major: l.Version.major,
        minor: l.Version.minor
      };
      a.record = null;
      a.session = null;
      a.peerCertificate = null;
      a.state = {
        pending: null,
        current: null
      };
      a.entity;
      l.ConnectionEnd.client;
      a.expect = 0;
      a.fragmented = null;
      a.records = [];
      a.open = !1;
      a.handshakes = 0;
      a.handshaking = !1;
      a.isConnected = !1;
      a.fail = !(e || void 0 === e);
      a.input.clear();
      a.tlsData.clear();
      a.data.clear();
      a.state.current = l.createConnectionState(a);
    }
  };
  a.reset();
  a.handshake = function (e) {
    if (a.entity !== l.ConnectionEnd.client) a.error(a, {
      message: "Cannot initiate handshake as a server.",
      fatal: !1
    });else if (a.handshaking) a.error(a, {
      message: "Handshake already in progress.",
      fatal: !1
    });else {
      if (a.fail && !a.open && 0 === a.handshakes) {
        a.fail = !1;
      }
      a.handshaking = !0;
      var t = null;
      if ((e = e || "").length > 0) {
        if (a.sessionCache) {
          t = a.sessionCache.getSession(e);
        }
        if (null === t) {
          e = "";
        }
      }
      if (0 === e.length && a.sessionCache && null !== (t = a.sessionCache.getSession())) {
        e = t.id;
      }
      a.session = {
        id: e,
        version: null,
        cipherSuite: null,
        compressionMethod: null,
        serverCertificate: null,
        certificateRequest: null,
        clientCertificate: null,
        sp: {},
        md5: r.md.md5.create(),
        sha1: r.md.sha1.create()
      };
      if (t) {
        a.version = t.version;
        a.session.sp = t.sp;
      }
      a.session.sp.client_random = l.createRandom().getBytes();
      a.open = !0;
      l.queue(a, l.createRecord(a, {
        type: l.ContentType.handshake,
        data: l.createClientHello(a)
      }));
      l.flush(a);
    }
  };
  a.process = function (e) {
    var t = 0;
    if (e) {
      a.input.putBytes(e);
    }
    if (a.fail) {
      if (null !== a.record && a.record.ready && a.record.fragment.isEmpty()) {
        a.record = null;
      }
      if (null === a.record) {
        t = function (e) {
          var t = 0;
          var n = e.input;
          var i = n.length();
          if (i < 5) t = 5 - i;else {
            e.record = {
              type: n.getByte(),
              version: {
                major: n.getByte(),
                minor: n.getByte()
              },
              length: n.getInt16(),
              fragment: r.util.createBuffer(),
              ready: !1
            };
            var o = e.record.version.major === e.version.major;
            if (o && e.session && e.session.version) {
              o = e.record.version.minor === e.version.minor;
            }
            if (o) {
              e.error(e, {
                message: "Incompatible TLS version.",
                send: !0,
                alert: {
                  level: l.Alert.Level.fatal,
                  description: l.Alert.Description.protocol_version
                }
              });
            }
          }
          return t;
        }(a);
      }
      if (a.fail || null === a.record || a.record.ready) {
        t = function (e) {
          var t = 0;
          var n = e.input;
          var r = n.length();
          if (r < e.record.length) {
            t = e.record.length - r;
          } else {
            e.record.fragment.putBytes(n.getBytes(e.record.length));
            n.compact();
            if (e.state.current.read.update(e, e.record)) {
              if (null !== e.fragmented) {
                if (e.fragmented.type === e.record.type) {
                  e.fragmented.fragment.putBuffer(e.record.fragment);
                  e.record = e.fragmented;
                } else {
                  e.error(e, {
                    message: "Invalid fragmented record.",
                    send: !0,
                    alert: {
                      level: l.Alert.Level.fatal,
                      description: l.Alert.Description.unexpected_message
                    }
                  });
                }
              }
              e.record.ready = !0;
            }
          }
          return t;
        }(a);
      }
      if (!a.fail && null !== a.record && a.record.ready) {
        (function (e, t) {
          var n = t.type - l.ContentType.change_cipher_spec;
          var r = P[e.entity][e.expect];
          if (n in r) {
            r[n](e, t);
          } else {
            l.handleUnexpected(e, t);
          }
        })(a, a.record);
      }
    }
    return t;
  };
  a.prepare = function (e) {
    l.queue(a, l.createRecord(a, {
      type: l.ContentType.application_data,
      data: r.util.createBuffer(e)
    }));
    return l.flush(a);
  };
  a.prepareHeartbeatRequest = function (e, t) {
    if (e instanceof r.util.ByteBuffer) {
      e = e.bytes();
    }
    if (void 0 === t) {
      t = e.length;
    }
    a.expectedHeartbeatPayload = e;
    l.queue(a, l.createRecord(a, {
      type: l.ContentType.heartbeat,
      data: l.createHeartbeat(l.HeartbeatMessageType.heartbeat_request, e, t)
    }));
    return l.flush(a);
  };
  a.close = function (e) {
    if (!a.fail && a.sessionCache && a.session) {
      var t = {
        id: a.session.id,
        version: a.session.version,
        sp: a.session.sp
      };
      t.sp.keys = null;
      a.sessionCache.setSession(t.id, t);
    }
    if (a.open) {
      a.open = !1;
      a.input.clear();
      if (a.isConnected || a.handshaking) {
        a.isConnected = a.handshaking = !1;
        l.queue(a, l.createAlert(a, {
          level: l.Alert.Level.warning,
          description: l.Alert.Description.close_notify
        }));
        l.flush(a);
      }
      a.closed(a);
    }
    a.reset(e);
  };
  return a;
}, module.exports = r.tls = r.tls || {}, l) if ("function" != typeof l[H]) {
  r.tls[H] = l[H];
}
r.tls.prf_tls1 = i;
r.tls.hmac_sha1 = function (e, t, n) {
  var i = r.hmac.create();
  i.start("SHA1", e);
  var o = r.util.createBuffer();
  o.putInt32(t[0]);
  o.putInt32(t[1]);
  o.putByte(n.type);
  o.putByte(n.version.major);
  o.putByte(n.version.minor);
  o.putInt16(n.length);
  o.putBytes(n.fragment.bytes());
  i.update(o.getBytes());
  return i.digest().getBytes();
};
r.tls.createSessionCache = l.createSessionCache;
r.tls.createConnection = l.createConnection;