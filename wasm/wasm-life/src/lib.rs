use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    alert("test");
}
