USE business_inventory;

UPDATE categorias SET nombre='Audio', descripcion='AirPods, EarPods y audifonos' WHERE id=1;
UPDATE categorias SET nombre='Accesorios', descripcion='Accesorios para dispositivos' WHERE id=2;
UPDATE categorias SET nombre='Estuches', descripcion='Estuches para AirPods e iPhone' WHERE id=3;
UPDATE categorias SET nombre='Apple', descripcion='Cables, adaptadores y cargadores Apple' WHERE id=4;
UPDATE categorias SET nombre='Samsung', descripcion='Productos y accesorios Samsung' WHERE id=5;
UPDATE categorias SET nombre='Cables', descripcion='Cables de carga y datos' WHERE id=6;

UPDATE proveedores SET nombre='Drop_Zone CR', correo='dropzonecr@gmail.com', telefono='+506 8312 0950', direccion='El Roble, Puntarenas, Costa Rica' WHERE id=1;
UPDATE proveedores SET nombre='Apple Collection CR', correo='ventas@applecollection.example', telefono='+506 2222 1002', direccion='San Jose, Costa Rica' WHERE id=2;
UPDATE proveedores SET nombre='Samsung Mobile CR', correo='ventas@samsungmobile.example', telefono='+506 2222 1003', direccion='Heredia, Costa Rica' WHERE id=3;
UPDATE proveedores SET nombre='Accesorios El Roble', correo='contacto@accesorioselroble.example', telefono='+506 2222 1004', direccion='El Roble, Puntarenas' WHERE id=4;
UPDATE proveedores SET nombre='Distribuciones Puntarenas', correo='ventas@distribucionesp.example', telefono='+506 2222 1005', direccion='Puntarenas, Costa Rica' WHERE id=5;

UPDATE productos SET codigo='DZ-001', nombre='AirPods Pro 3', descripcion='Audifonos inalambricos Drop_Zone', precio=25000, categoria_id=1, proveedor_id=1, imagen_url='/products/airpods-pro-3.webp' WHERE codigo='COMP-001';
UPDATE productos SET codigo='DZ-002', nombre='AirPods Pro 2', descripcion='Audifonos inalambricos Drop_Zone', precio=20000, categoria_id=1, proveedor_id=1, imagen_url='/products/airpods-pro-2.webp' WHERE codigo='COMP-002';
UPDATE productos SET codigo='DZ-003', nombre='AirPods 3', descripcion='Audio inalambrico para uso diario', precio=16000, categoria_id=1, proveedor_id=1, imagen_url='/products/airpods-3.webp' WHERE codigo='COMP-003';
UPDATE productos SET codigo='DZ-004', nombre='AirPods 4', descripcion='Audio inalambrico compacto', precio=18000, categoria_id=1, proveedor_id=1, imagen_url='/products/airpods-4.webp' WHERE codigo='COMP-004';
UPDATE productos SET codigo='DZ-005', nombre='AirPods Max', descripcion='Audifonos de diadema', precio=27000, categoria_id=1, proveedor_id=1, imagen_url='/products/airpods-max-azul-medianoche.webp' WHERE codigo='COMP-005';
UPDATE productos SET codigo='DZ-006', nombre='Apple Pencil', descripcion='Lapiz digital para iPad', precio=19000, categoria_id=2, proveedor_id=2, imagen_url='/products/apple-pencil.webp' WHERE codigo='ACC-001';
UPDATE productos SET codigo='DZ-007', nombre='Estuches para AirPods', descripcion='Estuches protectores en varios colores', precio=4000, categoria_id=3, proveedor_id=4, imagen_url='/products/estuche-azul-oscuro.webp' WHERE codigo='ACC-002';
UPDATE productos SET codigo='DZ-008', nombre='Estuches para iPhone', descripcion='Proteccion para tu iPhone', precio=6000, categoria_id=3, proveedor_id=4, imagen_url='/products/estuche-iphone-azul-oscuro.webp' WHERE codigo='ACC-003';
UPDATE productos SET codigo='DZ-009', nombre='Samsung Galaxy Buds3 Pro', descripcion='Audifonos Samsung premium', precio=20000, categoria_id=1, proveedor_id=3, imagen_url='/products/galaxy-buds3-pro.webp' WHERE codigo='ACC-004';
UPDATE productos SET codigo='DZ-010', nombre='Cargador Samsung 45W USB-C', descripcion='Carga rapida Samsung', precio=8000, categoria_id=5, proveedor_id=3, imagen_url='/products/samsung-cargador-45w.webp' WHERE codigo='ACC-005';
UPDATE productos SET codigo='DZ-011', nombre='Adaptador Samsung 45W USB-C', descripcion='Adaptador de carga Samsung', precio=6000, categoria_id=5, proveedor_id=3, imagen_url='/products/samsung-adaptador-45w-sin-cable.webp' WHERE codigo='AUD-001';
UPDATE productos SET codigo='DZ-012', nombre='Cable USB-C 60W de 1 m', descripcion='Cable de carga y datos', precio=4000, categoria_id=6, proveedor_id=5, imagen_url='/products/cable-usb-c-60w-1m.webp' WHERE codigo='AUD-002';
UPDATE productos SET codigo='DZ-013', nombre='Adaptador de corriente USB-C Apple', descripcion='Adaptador Apple de 35W', precio=6500, categoria_id=4, proveedor_id=2, imagen_url='/products/apple-adaptador-usb-c-35w.webp' WHERE codigo='AUD-003';
UPDATE productos SET codigo='DZ-014', nombre='EarPods con cable', descripcion='Audifonos con conexion USB-C', precio=10000, categoria_id=1, proveedor_id=2, imagen_url='/products/earpods-usb-c-premium.webp' WHERE codigo='AUD-004';
UPDATE productos SET codigo='DZ-015', nombre='Kit cargador USB-C 35W con cable', descripcion='Kit completo de carga Apple', precio=9500, categoria_id=4, proveedor_id=2, imagen_url='/products/kit-cargador-apple-35w-cable.webp' WHERE codigo='AUD-005';
UPDATE productos SET codigo='DZ-016', nombre='Adaptador para audifonos 3.5 mm', descripcion='Adaptador de audio compacto', precio=3700, categoria_id=4, proveedor_id=2, imagen_url='/products/adaptador-audio-usb-c.webp' WHERE codigo='ALM-001';
UPDATE productos SET codigo='DZ-017', nombre='Bateria portatil magnetica para iPhone', descripcion='Bateria magnetica de 5000mAh', precio=10000, categoria_id=4, proveedor_id=2, imagen_url='/products/bateria-magnetica-5000mah.webp' WHERE codigo='ALM-002';
UPDATE productos SET codigo='DZ-018', nombre='Cable Samsung USB-C a USB-C 3A', descripcion='Cable Samsung de carga rapida', precio=5000, categoria_id=5, proveedor_id=3, imagen_url='/products/cable-samsung-usbc-negro.webp' WHERE codigo='ALM-003';
UPDATE productos SET codigo='DZ-019', nombre='Cable USB-C a Lightning', descripcion='Cable para dispositivos Apple', precio=5000, categoria_id=4, proveedor_id=2, imagen_url='/products/cable-apple-usbc-lightning-1m.webp' WHERE codigo='ALM-004';
UPDATE productos SET codigo='DZ-020', nombre='Cable Lightning a USB de 1 m', descripcion='Cable de carga Apple', precio=4000, categoria_id=4, proveedor_id=2, imagen_url='/products/cable-apple-lightning-usb-1m.png' WHERE codigo='ALM-005';
