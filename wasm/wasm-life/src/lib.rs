use std::fmt;
use std::mem;

use js_sys::Math::random;
use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(transparent)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Cell {
    age: u8,
}

impl Cell {
    fn new(alive: bool) -> Cell {
        if alive {
            Cell { age: 1 }
        } else {
            Cell { age: 0 }
        }
    }

    fn alive(&self) -> bool {
        self.age > 0
    }
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
    cells_next: Vec<Cell>,
}

fn initial_pattern(width: u32, height: u32) -> Vec<Cell> {
    (0..width * height)
        .map(|i| Cell::new(i % 2 == 0 || (random() > 0.9)))
        .collect()
}

impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                if self.cells[idx].alive() {
                    count += 1;
                }
            }
        }
        count
    }
}

#[wasm_bindgen]
impl Universe {
    pub fn tick(&mut self) {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    // Rule 1: Any live cell with fewer than two live neighbours
                    // dies, as if caused by underpopulation.
                    (c, x) if c.alive() && x < 2 => Cell::new(false),
                    // Rule 2: Any live cell with two or three live neighbours
                    // lives on to the next generation.
                    (c @ Cell { age }, 2) | (c @ Cell { age }, 3) if c.alive() => Cell {
                        age: if age < 255 { age + 1 } else { age },
                    },
                    // Rule 3: Any live cell with more than three live
                    // neighbours dies, as if by overpopulation.
                    (c, x) if c.alive() && x > 3 => Cell::new(false),
                    // Rule 4: Any dead cell with exactly three live neighbours
                    // becomes a live cell, as if by reproduction.
                    (c, 3) if !c.alive() => Cell::new(true),
                    // Other cells remain in the same state
                    (c, _) => c,
                };

                let next = &mut self.cells_next;
                next[idx] = next_cell;
            }
        }

        mem::swap(&mut self.cells, &mut self.cells_next);
    }

    pub fn restart(&mut self) {
        self.cells = initial_pattern(self.width, self.height);
        self.cells_next = self.cells.clone();
    }

    pub fn new() -> Universe {
        let width = 256;
        let height = 64;
        let cells = initial_pattern(width, height);
        let cells_next = cells.clone();

        Universe {
            width,
            height,
            cells,
            cells_next,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell.alive() { '◼' } else { '◻' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
